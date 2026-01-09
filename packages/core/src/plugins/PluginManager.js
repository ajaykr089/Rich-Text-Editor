"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
exports.createPluginManager = createPluginManager;
/**
 * Manages the lifecycle and coordination of editor plugins.
 * Handles plugin registration, command resolution, and event dispatching.
 */
var PluginManager = /** @class */ (function () {
    function PluginManager() {
        this.plugins = new Map();
        this.commands = new Map();
        this.keyBindings = new Map();
    }
    /**
     * Register a plugin with the manager.
     */
    PluginManager.prototype.register = function (plugin) {
        if (this.plugins.has(plugin.name)) {
            throw new Error("Plugin '".concat(plugin.name, "' is already registered"));
        }
        this.plugins.set(plugin.name, plugin);
        // Register commands
        var commands = plugin.getCommands();
        for (var _i = 0, _a = Object.entries(commands); _i < _a.length; _i++) {
            var _b = _a[_i], commandName = _b[0], command = _b[1];
            this.commands.set(commandName, { plugin: plugin, command: command });
        }
        // Register key bindings
        var keyBindings = plugin.getKeyBindings();
        for (var _c = 0, _d = Object.entries(keyBindings); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], commandName = _e[1];
            this.keyBindings.set(key, { plugin: plugin, commandName: commandName });
        }
        // Initialize the plugin
        plugin.init({
            schema: null, // Will be set when editor is created
            state: {},
            dispatch: function () { },
            view: null
        });
    };
    /**
     * Unregister a plugin from the manager.
     */
    PluginManager.prototype.unregister = function (pluginName) {
        var plugin = this.plugins.get(pluginName);
        if (!plugin) {
            return;
        }
        // Remove commands
        for (var _i = 0, _a = this.commands.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], commandName = _b[0], cmdPlugin = _b[1].plugin;
            if (cmdPlugin === plugin) {
                this.commands.delete(commandName);
            }
        }
        // Remove key bindings
        for (var _c = 0, _d = this.keyBindings.entries(); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], keyPlugin = _e[1].plugin;
            if (keyPlugin === plugin) {
                this.keyBindings.delete(key);
            }
        }
        // Destroy the plugin
        plugin.destroy({
            schema: null,
            state: {},
            dispatch: function () { },
            view: null
        });
        this.plugins.delete(pluginName);
    };
    /**
     * Get all registered plugins.
     */
    PluginManager.prototype.getPlugins = function () {
        return Array.from(this.plugins.values());
    };
    /**
     * Get a plugin by name.
     */
    PluginManager.prototype.getPlugin = function (name) {
        return this.plugins.get(name);
    };
    /**
     * Execute a command by name.
     */
    PluginManager.prototype.executeCommand = function (commandName, state, dispatch) {
        var commandEntry = this.commands.get(commandName);
        if (!commandEntry) {
            return false;
        }
        var command = commandEntry.command;
        return command(state, dispatch) !== false;
    };
    /**
     * Check if a command is available.
     */
    PluginManager.prototype.hasCommand = function (commandName) {
        return this.commands.has(commandName);
    };
    /**
     * Get the command function by name.
     */
    PluginManager.prototype.getCommand = function (commandName) {
        var entry = this.commands.get(commandName);
        return entry === null || entry === void 0 ? void 0 : entry.command;
    };
    /**
     * Handle a key event and execute the corresponding command if found.
     */
    PluginManager.prototype.handleKey = function (key, state, dispatch) {
        var binding = this.keyBindings.get(key);
        if (!binding) {
            return false;
        }
        return this.executeCommand(binding.commandName, state, dispatch);
    };
    /**
     * Get all key bindings.
     */
    PluginManager.prototype.getKeyBindings = function () {
        return new Map(this.keyBindings);
    };
    /**
     * Notify all plugins of a transaction.
     */
    PluginManager.prototype.onTransaction = function (tr, state) {
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin.onTransaction(tr, {
                schema: state.schema,
                state: state,
                dispatch: function () { },
                view: null
            });
        }
    };
    /**
     * Notify all plugins of a selection change.
     */
    PluginManager.prototype.onSelectionChange = function (selection, state) {
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin.onSelectionChange(selection, {
                schema: state.schema,
                state: state,
                dispatch: function () { },
                view: null
            });
        }
    };
    /**
     * Notify all plugins of focus event.
     */
    PluginManager.prototype.onFocus = function (state) {
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin.onFocus({
                schema: state.schema,
                state: state,
                dispatch: function () { },
                view: null
            });
        }
    };
    /**
     * Notify all plugins of blur event.
     */
    PluginManager.prototype.onBlur = function (state) {
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            plugin.onBlur({
                schema: state.schema,
                state: state,
                dispatch: function () { },
                view: null
            });
        }
    };
    /**
     * Get all schema extensions from plugins.
     */
    PluginManager.prototype.getSchemaExtensions = function () {
        var extensions = [];
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            var extension = plugin.getSchemaExtensions();
            if (extension) {
                extensions.push(extension);
            }
        }
        return extensions;
    };
    /**
     * Get all toolbar items from plugins.
     */
    PluginManager.prototype.getToolbarItems = function () {
        var items = [];
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            var toolbar_1 = plugin.getToolbarConfig();
            if (toolbar_1 === null || toolbar_1 === void 0 ? void 0 : toolbar_1.items) {
                items.push.apply(items, toolbar_1.items);
            }
        }
        return items;
    };
    /**
     * Get all menu items from plugins.
     */
    PluginManager.prototype.getMenuItems = function () {
        var items = [];
        for (var _i = 0, _a = this.plugins.values(); _i < _a.length; _i++) {
            var plugin = _a[_i];
            items.push.apply(items, plugin.getMenuItems());
        }
        return items;
    };
    return PluginManager;
}());
exports.PluginManager = PluginManager;
/**
 * Create a plugin manager instance.
 */
function createPluginManager() {
    return new PluginManager();
}
