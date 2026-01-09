"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
var EditorState_1 = require("./EditorState");
var Schema_1 = require("./schema/Schema");
var CommandManager_1 = require("./commands/CommandManager");
/**
 * Main editor class that coordinates state, plugins, and commands.
 */
var Editor = /** @class */ (function () {
    function Editor(config) {
        if (config === void 0) { config = {}; }
        this.eventListeners = new Map();
        this.config = config;
        this.commandManager = new CommandManager_1.CommandManager();
        // Initialize schema
        var schema = config.schema || Schema_1.defaultSchema;
        // Create initial document
        var doc = config.doc;
        if (!doc) {
            if (config.content) {
                // Parse HTML content (simplified)
                doc = this.parseHTML(config.content, schema);
            }
            else {
                // Create empty document
                doc = schema.nodes.doc.create({}, schema.nodes.paragraph.create());
            }
        }
        // Create initial state
        this._state = EditorState_1.EditorState.create({
            doc: doc,
            schema: schema,
            plugins: config.plugins || []
        });
        // Register plugin commands
        this.registerPluginCommands();
        // Initialize plugins
        this.initializePlugins();
    }
    Object.defineProperty(Editor.prototype, "state", {
        /**
         * Get the current editor state.
         */
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Dispatch a transaction to update the editor state.
     */
    Editor.prototype.dispatch = function (tr) {
        var newState = this._state.apply(tr);
        var oldState = this._state;
        this._state = newState;
        // Notify plugins
        this.notifyPlugins('onTransaction', tr);
        // Call update handler
        if (this.config.onUpdate) {
            this.config.onUpdate({ editor: this, transaction: tr });
        }
        // Emit update event
        this.emit('update', { editor: this, transaction: tr });
    };
    /**
     * Execute a command by name.
     */
    Editor.prototype.executeCommand = function (name) {
        var _this = this;
        return this.commandManager.execute(name, this._state, function (tr) { return _this.dispatch(tr); });
    };
    /**
     * Get the document as HTML.
     */
    Editor.prototype.getHTML = function () {
        return this.serializeToHTML(this._state.doc);
    };
    /**
     * Get the document as JSON.
     */
    Editor.prototype.getJSON = function () {
        return this._state.doc.toJSON();
    };
    /**
     * Set the content from HTML.
     */
    Editor.prototype.setContent = function (html) {
        var doc = this.parseHTML(html, this._state.schema);
        var tr = this._state.tr.setDoc(doc);
        this.dispatch(tr);
    };
    /**
     * Destroy the editor and clean up resources.
     */
    Editor.prototype.destroy = function () {
        // Notify plugins
        this.notifyPlugins('onDestroy');
        // Clear event listeners
        this.eventListeners.clear();
        // Clear commands
        this.commandManager.clear();
    };
    /**
     * Add an event listener.
     */
    Editor.prototype.on = function (event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    };
    /**
     * Remove an event listener.
     */
    Editor.prototype.off = function (event, handler) {
        var handlers = this.eventListeners.get(event);
        if (handlers) {
            var index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    };
    /**
     * Emit an event.
     */
    Editor.prototype.emit = function (event, data) {
        var handlers = this.eventListeners.get(event);
        if (handlers) {
            handlers.forEach(function (handler) { return handler(data); });
        }
    };
    /**
     * Register commands from all plugins.
     */
    Editor.prototype.registerPluginCommands = function () {
        for (var _i = 0, _a = this._state.plugins; _i < _a.length; _i++) {
            var plugin = _a[_i];
            var commands = plugin.getCommands();
            for (var _b = 0, _c = Object.entries(commands); _b < _c.length; _b++) {
                var _d = _c[_b], name_1 = _d[0], command = _d[1];
                this.commandManager.register(name_1, command);
            }
        }
    };
    /**
     * Initialize all plugins.
     */
    Editor.prototype.initializePlugins = function () {
        var _this = this;
        var context = {
            schema: this._state.schema,
            state: this._state,
            dispatch: function (tr) { return _this.dispatch(tr); }
        };
        for (var _i = 0, _a = this._state.plugins; _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin.init(context);
        }
    };
    /**
     * Notify plugins of events.
     */
    Editor.prototype.notifyPlugins = function (method) {
        var _a;
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var context = {
            schema: this._state.schema,
            state: this._state,
            dispatch: function (tr) { return _this.dispatch(tr); }
        };
        for (var _b = 0, _c = this._state.plugins; _b < _c.length; _b++) {
            var plugin = _c[_b];
            if (typeof plugin[method] === 'function') {
                (_a = plugin)[method].apply(_a, __spreadArray(__spreadArray([], args, false), [context], false));
            }
        }
    };
    /**
     * Parse HTML content to document nodes (simplified implementation).
     */
    Editor.prototype.parseHTML = function (html, schema) {
        // This is a simplified parser - a real implementation would be more robust
        if (!html.trim()) {
            return schema.nodes.doc.create({}, schema.nodes.paragraph.create());
        }
        // For now, create a simple paragraph with the text content
        var textContent = html.replace(/<[^>]*>/g, '');
        var textNode = schema.nodes.text.create({ text: textContent });
        var paragraph = schema.nodes.paragraph.create({}, [textNode]);
        return schema.nodes.doc.create({}, [paragraph]);
    };
    /**
     * Serialize document to HTML (simplified implementation).
     */
    Editor.prototype.serializeToHTML = function (doc) {
        // This is a simplified serializer - a real implementation would be more robust
        return doc.textContent;
    };
    return Editor;
}());
exports.Editor = Editor;
