"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
exports.createCommandManager = createCommandManager;
/**
 * Command manager for registering and executing commands.
 */
var CommandManager = /** @class */ (function () {
    function CommandManager() {
        this.commands = new Map();
    }
    /**
     * Register a command.
     */
    CommandManager.prototype.register = function (name, command) {
        this.commands.set(name, command);
    };
    /**
     * Execute a command by name.
     */
    CommandManager.prototype.execute = function (name, state, dispatch, view) {
        var command = this.commands.get(name);
        if (!command) {
            console.warn("Command \"".concat(name, "\" not found"));
            return false;
        }
        try {
            return command(state, dispatch, view);
        }
        catch (error) {
            console.error("Error executing command \"".concat(name, "\":"), error);
            return false;
        }
    };
    /**
     * Check if a command exists.
     */
    CommandManager.prototype.has = function (name) {
        return this.commands.has(name);
    };
    /**
     * Get all registered command names.
     */
    CommandManager.prototype.getCommandNames = function () {
        return Array.from(this.commands.keys());
    };
    /**
     * Clear all commands.
     */
    CommandManager.prototype.clear = function () {
        this.commands.clear();
    };
    return CommandManager;
}());
exports.CommandManager = CommandManager;
/**
 * Create a command manager instance.
 */
function createCommandManager() {
    return new CommandManager();
}
