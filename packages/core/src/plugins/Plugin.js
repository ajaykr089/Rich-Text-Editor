"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
exports.createPlugin = createPlugin;
/**
 * Editor plugin class.
 * All editor features (bold, tables, images, etc.) are implemented as plugins.
 */
var Plugin = /** @class */ (function () {
    function Plugin(spec) {
        this.spec = spec;
    }
    Object.defineProperty(Plugin.prototype, "name", {
        /**
         * Get the plugin name.
         */
        get: function () {
            return this.spec.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "version", {
        /**
         * Get the plugin version.
         */
        get: function () {
            return this.spec.version || '1.0.0';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize the plugin.
     */
    Plugin.prototype.init = function (ctx) {
        var _a, _b;
        (_b = (_a = this.spec).onInit) === null || _b === void 0 ? void 0 : _b.call(_a, ctx);
    };
    /**
     * Destroy the plugin.
     */
    Plugin.prototype.destroy = function (ctx) {
        var _a, _b;
        (_b = (_a = this.spec).onDestroy) === null || _b === void 0 ? void 0 : _b.call(_a, ctx);
    };
    /**
     * Handle transaction events.
     */
    Plugin.prototype.onTransaction = function (tr, ctx) {
        var _a, _b;
        (_b = (_a = this.spec).onTransaction) === null || _b === void 0 ? void 0 : _b.call(_a, tr, ctx);
    };
    /**
     * Handle selection change events.
     */
    Plugin.prototype.onSelectionChange = function (selection, ctx) {
        var _a, _b;
        (_b = (_a = this.spec).onSelectionChange) === null || _b === void 0 ? void 0 : _b.call(_a, selection, ctx);
    };
    /**
     * Handle focus events.
     */
    Plugin.prototype.onFocus = function (ctx) {
        var _a, _b;
        (_b = (_a = this.spec).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, ctx);
    };
    /**
     * Handle blur events.
     */
    Plugin.prototype.onBlur = function (ctx) {
        var _a, _b;
        (_b = (_a = this.spec).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, ctx);
    };
    /**
     * Get schema extensions provided by this plugin.
     */
    Plugin.prototype.getSchemaExtensions = function () {
        return this.spec.schema;
    };
    /**
     * Get commands provided by this plugin.
     */
    Plugin.prototype.getCommands = function () {
        return this.spec.commands || {};
    };
    /**
     * Get toolbar configuration.
     */
    Plugin.prototype.getToolbarConfig = function () {
        return this.spec.toolbar;
    };
    /**
     * Get menu items.
     */
    Plugin.prototype.getMenuItems = function () {
        return this.spec.menus || [];
    };
    /**
     * Get key bindings.
     */
    Plugin.prototype.getKeyBindings = function () {
        return this.spec.keybindings || {};
    };
    /**
     * Get node view factories.
     */
    Plugin.prototype.getNodeViews = function () {
        return this.spec.nodeViews || {};
    };
    /**
     * Get mark view factories.
     */
    Plugin.prototype.getMarkViews = function () {
        return this.spec.markViews || {};
    };
    return Plugin;
}());
exports.Plugin = Plugin;
/**
 * Create a plugin from a specification.
 */
function createPlugin(spec) {
    return new Plugin(spec);
}
