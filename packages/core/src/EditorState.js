"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceStep = exports.RemoveMarkStep = exports.AddMarkStep = exports.Transaction = exports.EditorState = void 0;
var Node_1 = require("./model/Node");
var Selection_1 = require("./Selection");
var Fragment_1 = require("./model/Fragment");
/**
 * Immutable editor state representing the complete state of the editor at a point in time.
 * All state changes are made through transactions to ensure predictability and enable features
 * like undo/redo, collaboration, and time-travel debugging.
 */
var EditorState = /** @class */ (function () {
    function EditorState(config) {
        this.doc = config.doc;
        this.schema = config.schema;
        this.selection = config.selection || Selection_1.Selection.atStart(this.doc);
        this.plugins = Object.freeze(config.plugins || []);
        this.version = config.version || 0;
        this.storedMarks = config.storedMarks || null;
    }
    /**
     * Create a new EditorState from configuration.
     */
    EditorState.create = function (config) {
        return new EditorState(config);
    };
    /**
     * Create a new EditorState with updated properties.
     * This method creates a new immutable instance while sharing unchanged references.
     */
    EditorState.prototype.update = function (updates) {
        var _a, _b, _c, _d, _e;
        return new EditorState({
            doc: (_a = updates.doc) !== null && _a !== void 0 ? _a : this.doc,
            schema: (_b = updates.schema) !== null && _b !== void 0 ? _b : this.schema,
            selection: (_c = updates.selection) !== null && _c !== void 0 ? _c : this.selection,
            plugins: (_d = updates.plugins) !== null && _d !== void 0 ? _d : this.plugins,
            version: ((_e = updates.version) !== null && _e !== void 0 ? _e : this.version) + 1
        });
    };
    /**
     * Apply a transaction to create a new state.
     * Transactions encapsulate all state changes and can be reversed for undo functionality.
     */
    EditorState.prototype.apply = function (tr) {
        return tr.apply(this);
    };
    Object.defineProperty(EditorState.prototype, "tr", {
        /**
         * Create a transaction that can modify this state.
         */
        get: function () {
            return new Transaction(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Check if this state is equal to another state.
     * Used for change detection and optimization.
     */
    EditorState.prototype.equals = function (other) {
        return (this.doc === other.doc &&
            this.schema === other.schema &&
            this.selection.equals(other.selection) &&
            this.plugins === other.plugins &&
            this.version === other.version);
    };
    Object.defineProperty(EditorState.prototype, "storedMarksGetter", {
        /**
         * Get stored marks at the current selection.
         * Stored marks are marks that should be applied to newly typed content.
         */
        get: function () {
            return this.storedMarks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EditorState.prototype, "isEditable", {
        /**
         * Check if the document can be modified at the current selection.
         */
        get: function () {
            return true; // Can be overridden by plugins or configuration
        },
        enumerable: false,
        configurable: true
    });
    return EditorState;
}());
exports.EditorState = EditorState;
/**
 * Transaction class for batched state changes.
 * Transactions ensure atomic updates and enable undo/redo functionality.
 */
var Transaction = /** @class */ (function () {
    function Transaction(before) {
        this.steps = [];
        this.metadata = new Map();
        this.updated = {};
        this.before = before;
    }
    /**
     * Apply this transaction to create a new editor state.
     */
    Transaction.prototype.apply = function (before) {
        if (before === void 0) { before = this.before; }
        var state = before;
        // Apply all steps in order
        for (var _i = 0, _a = this.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            var result = step.apply(state);
            if (result.failed) {
                throw new Error("Transaction failed: ".concat(result.failed));
            }
            state = result.state;
        }
        // Apply any direct state updates
        if (Object.keys(this.updated).length > 0) {
            state = state.update(this.updated);
        }
        return state;
    };
    /**
     * Add a step to this transaction.
     */
    Transaction.prototype.step = function (step) {
        this.steps.push(step);
        return this;
    };
    /**
     * Set document directly (bypasses normal step validation).
     */
    Transaction.prototype.setDoc = function (doc) {
        this.updated.doc = doc;
        return this;
    };
    /**
     * Set selection directly.
     */
    Transaction.prototype.setSelection = function (selection) {
        this.updated.selection = selection;
        return this;
    };
    /**
     * Add metadata to this transaction.
     */
    Transaction.prototype.setMeta = function (key, value) {
        this.metadata.set(key, value);
        return this;
    };
    /**
     * Get metadata from this transaction.
     */
    Transaction.prototype.getMeta = function (key) {
        return this.metadata.get(key);
    };
    /**
     * Add stored marks to this transaction.
     */
    Transaction.prototype.setStoredMarks = function (marks) {
        this.updated.storedMarks = marks;
        return this;
    };
    /**
     * Add a mark to a range.
     */
    Transaction.prototype.addMark = function (from, to, mark) {
        var step = new AddMarkStep(from, to, mark);
        return this.step(step);
    };
    /**
     * Remove a mark from a range.
     */
    Transaction.prototype.removeMark = function (from, to, markType) {
        var step = new RemoveMarkStep(from, to, markType);
        return this.step(step);
    };
    /**
     * Insert text at a position.
     */
    Transaction.prototype.insertText = function (pos, text, marks) {
        var step = new ReplaceStep(pos, pos, Fragment_1.Fragment.from([Node_1.Node.text(text, marks)]));
        return this.step(step);
    };
    /**
     * Replace content in a range.
     */
    Transaction.prototype.replace = function (from, to, slice) {
        var step = new ReplaceStep(from, to, slice);
        return this.step(step);
    };
    Object.defineProperty(Transaction.prototype, "beforeState", {
        /**
         * Get the state before this transaction.
         */
        get: function () {
            return this.before;
        },
        enumerable: false,
        configurable: true
    });
    return Transaction;
}());
exports.Transaction = Transaction;
/**
 * Step for adding a mark to a range.
 */
var AddMarkStep = /** @class */ (function () {
    function AddMarkStep(from, to, mark) {
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    AddMarkStep.prototype.apply = function (state) {
        var newDoc = state.doc.addMark(this.from, this.to, this.mark);
        return {
            state: state.update({ doc: newDoc })
        };
    };
    return AddMarkStep;
}());
exports.AddMarkStep = AddMarkStep;
/**
 * Step for removing a mark from a range.
 */
var RemoveMarkStep = /** @class */ (function () {
    function RemoveMarkStep(from, to, markType) {
        this.from = from;
        this.to = to;
        this.markType = markType;
    }
    RemoveMarkStep.prototype.apply = function (state) {
        var newDoc = state.doc.removeMark(this.from, this.to, this.markType);
        return {
            state: state.update({ doc: newDoc })
        };
    };
    return RemoveMarkStep;
}());
exports.RemoveMarkStep = RemoveMarkStep;
/**
 * Step for replacing content in a range.
 */
var ReplaceStep = /** @class */ (function () {
    function ReplaceStep(from, to, slice) {
        this.from = from;
        this.to = to;
        this.slice = slice;
    }
    ReplaceStep.prototype.apply = function (state) {
        var newDoc = state.doc.replace(this.from, this.to, this.slice);
        return {
            state: state.update({ doc: newDoc })
        };
    };
    return ReplaceStep;
}());
exports.ReplaceStep = ReplaceStep;
