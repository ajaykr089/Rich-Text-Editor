"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = exports.ResolvedPos = exports.NodeSelection = exports.TextSelection = exports.Selection = void 0;
/**
 * Base selection interface representing a range or position in the document.
 */
var Selection = /** @class */ (function () {
    function Selection() {
    }
    /**
     * Create a selection at the start of the document.
     */
    Selection.atStart = function (doc) {
        return TextSelection.create(doc, 0);
    };
    /**
     * Create a selection at the end of the document.
     */
    Selection.atEnd = function (doc) {
        return TextSelection.create(doc, doc.content.size);
    };
    Object.defineProperty(Selection.prototype, "content", {
        /**
         * Get the content of this selection.
         */
        get: function () {
            return new Slice(this.$from.doc.slice(this.from, this.to), 0, 0);
        },
        enumerable: false,
        configurable: true
    });
    return Selection;
}());
exports.Selection = Selection;
/**
 * Text selection representing a cursor position or range in text.
 */
var TextSelection = /** @class */ (function (_super) {
    __extends(TextSelection, _super);
    function TextSelection($from, $to) {
        var _this = _super.call(this) || this;
        _this.$from = $from;
        _this.$to = $to || $from;
        _this.from = $from.pos;
        _this.to = _this.$to.pos;
        return _this;
    }
    Object.defineProperty(TextSelection.prototype, "empty", {
        get: function () {
            return this.from === this.to;
        },
        enumerable: false,
        configurable: true
    });
    TextSelection.create = function (doc, pos) {
        return new TextSelection(ResolvedPos.resolve(doc, pos));
    };
    TextSelection.prototype.equals = function (other) {
        return other instanceof TextSelection &&
            this.$from.pos === other.$from.pos &&
            this.$to.pos === other.$to.pos;
    };
    TextSelection.prototype.map = function (doc, mapping) {
        // Basic mapping implementation - will be enhanced
        var newFrom = mapping.map(this.from);
        var newTo = mapping.map(this.to);
        return TextSelection.create(doc, Math.min(newFrom, newTo));
    };
    TextSelection.prototype.toJSON = function () {
        return {
            type: 'text',
            from: this.from,
            to: this.to
        };
    };
    return TextSelection;
}(Selection));
exports.TextSelection = TextSelection;
/**
 * Node selection representing the selection of a single node.
 */
var NodeSelection = /** @class */ (function (_super) {
    __extends(NodeSelection, _super);
    function NodeSelection($from) {
        var _this = _super.call(this) || this;
        _this.$from = $from;
        _this.$to = ResolvedPos.resolve($from.doc, $from.pos + $from.nodeAfter.nodeSize);
        _this.from = $from.pos;
        _this.to = _this.$to.pos;
        _this.node = $from.nodeAfter;
        return _this;
    }
    Object.defineProperty(NodeSelection.prototype, "empty", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    NodeSelection.create = function (doc, pos) {
        var $pos = ResolvedPos.resolve(doc, pos);
        if (!$pos.nodeAfter) {
            throw new Error('No node at position ' + pos);
        }
        return new NodeSelection($pos);
    };
    NodeSelection.prototype.equals = function (other) {
        return other instanceof NodeSelection &&
            this.$from.pos === other.$from.pos;
    };
    NodeSelection.prototype.map = function (doc, mapping) {
        var newPos = mapping.map(this.from);
        try {
            return NodeSelection.create(doc, newPos);
        }
        catch (_a) {
            return TextSelection.create(doc, newPos);
        }
    };
    NodeSelection.prototype.toJSON = function () {
        return {
            type: 'node',
            from: this.from,
            to: this.to
        };
    };
    return NodeSelection;
}(Selection));
exports.NodeSelection = NodeSelection;
/**
 * Resolved position in the document with context information.
 */
var ResolvedPos = /** @class */ (function () {
    function ResolvedPos(pos, doc, depth, parentOffset) {
        this.pos = pos;
        this.doc = doc;
        this.depth = depth;
        this.parentOffset = parentOffset;
    }
    /**
     * Resolve a position in the document to a ResolvedPos.
     */
    ResolvedPos.resolve = function (doc, pos) {
        if (pos < 0 || pos > doc.content.size) {
            throw new Error("Position ".concat(pos, " out of range"));
        }
        var depth = 0;
        var parentOffset = pos;
        var node = doc;
        // Traverse down to find the exact position
        while (depth < 100) { // Prevent infinite loops
            if (parentOffset === 0)
                break;
            var child = node.content.findChildAt(parentOffset);
            if (!child)
                break;
            depth++;
            parentOffset -= child.offset;
            node = child.node;
        }
        return new ResolvedPos(pos, doc, depth, parentOffset);
    };
    Object.defineProperty(ResolvedPos.prototype, "node", {
        /**
         * Get the node at this position.
         */
        get: function () {
            return this.doc.nodeAt(this.pos);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResolvedPos.prototype, "nodeAfter", {
        /**
         * Get the node after this position.
         */
        get: function () {
            return this.doc.nodeAt(this.pos);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResolvedPos.prototype, "nodeBefore", {
        /**
         * Get the node before this position.
         */
        get: function () {
            return this.pos > 0 ? this.doc.nodeAt(this.pos - 1) : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the parent node at the given depth.
     */
    ResolvedPos.prototype.parent = function (depth) {
        var targetDepth = depth !== null && depth !== void 0 ? depth : this.depth - 1;
        if (targetDepth < 0)
            return this.doc;
        var pos = this;
        for (var i = this.depth; i > targetDepth; i--) {
            pos = pos.parentPos();
        }
        return pos.node;
    };
    /**
     * Get the resolved position of the parent.
     */
    ResolvedPos.prototype.parentPos = function () {
        var pos = 0;
        var node = this.doc;
        var path = this.path();
        for (var i = 0; i < path.length - 1; i++) {
            pos += path[i].offset + 1;
            node = path[i].node;
        }
        return ResolvedPos.resolve(this.doc, pos);
    };
    /**
     * Get the path from root to this position.
     */
    ResolvedPos.prototype.path = function () {
        var path = [];
        var pos = 0;
        var node = this.doc;
        while (pos < this.pos) {
            var child = node.content.findChildAt(pos);
            if (!child)
                break;
            path.push({ node: child.node, offset: child.offset });
            pos += child.offset;
            node = child.node;
        }
        return path;
    };
    Object.defineProperty(ResolvedPos.prototype, "isAtStart", {
        /**
         * Check if this position is at the start of its parent.
         */
        get: function () {
            return this.parentOffset === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResolvedPos.prototype, "isAtEnd", {
        /**
         * Check if this position is at the end of its parent.
         */
        get: function () {
            return this.parentOffset === this.parent().content.size;
        },
        enumerable: false,
        configurable: true
    });
    return ResolvedPos;
}());
exports.ResolvedPos = ResolvedPos;
/**
 * A slice of document content.
 */
var Slice = /** @class */ (function () {
    function Slice(content, openStart, openEnd) {
        this.content = content;
        this.openStart = openStart;
        this.openEnd = openEnd;
    }
    return Slice;
}());
exports.Slice = Slice;
// Placeholder - will be implemented in model/Fragment.ts
