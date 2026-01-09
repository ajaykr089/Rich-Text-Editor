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
exports.Fragment = void 0;
var Node_1 = require("./Node");
/**
 * An immutable sequence of nodes.
 * Fragments are the content of block nodes and represent the document structure.
 */
var Fragment = /** @class */ (function () {
    function Fragment(content) {
        if (content === void 0) { content = []; }
        this.content = content;
    }
    /**
     * Create a fragment from an array of nodes.
     */
    Fragment.from = function (nodes) {
        return new Fragment(nodes);
    };
    /**
     * Create a fragment from JSON.
     */
    Fragment.fromJSON = function (schema, json) {
        var nodes = json.map(function (nodeJSON) { return Node_1.Node.fromJSON(schema, nodeJSON); });
        return new Fragment(nodes);
    };
    Object.defineProperty(Fragment.prototype, "childCount", {
        /**
         * Get the number of child nodes.
         */
        get: function () {
            return this.content.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "children", {
        /**
         * Get the child nodes as an array.
         */
        get: function () {
            return this.content;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get a child node by index.
     */
    Fragment.prototype.child = function (index) {
        if (index < 0 || index >= this.content.length) {
            throw new Error("Index ".concat(index, " out of bounds"));
        }
        return this.content[index];
    };
    Object.defineProperty(Fragment.prototype, "firstChild", {
        /**
         * Get the first child node.
         */
        get: function () {
            return this.content.length > 0 ? this.content[0] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fragment.prototype, "lastChild", {
        /**
         * Get the last child node.
         */
        get: function () {
            return this.content.length > 0 ? this.content[this.content.length - 1] : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Find the child node at the given document position.
     */
    Fragment.prototype.findChildAt = function (pos) {
        var offset = 0;
        for (var _i = 0, _a = this.content; _i < _a.length; _i++) {
            var child = _a[_i];
            var childSize = child.nodeSize;
            if (pos >= offset && pos <= offset + childSize) {
                return { node: child, offset: offset };
            }
            offset += childSize;
        }
        return null;
    };
    Object.defineProperty(Fragment.prototype, "size", {
        /**
         * Get the total size of this fragment in the document.
         */
        get: function () {
            return this.content.reduce(function (size, node) { return size + node.nodeSize; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create a new fragment with a node appended.
     */
    Fragment.prototype.append = function (node) {
        return new Fragment(__spreadArray(__spreadArray([], this.content, true), [node], false));
    };
    /**
     * Create a new fragment by cutting out a slice.
     */
    Fragment.prototype.cut = function (from, to) {
        if (from === void 0) { from = 0; }
        var actualTo = to !== null && to !== void 0 ? to : this.size;
        if (from === 0 && actualTo === this.size) {
            return this;
        }
        var result = [];
        var pos = 0;
        for (var _i = 0, _a = this.content; _i < _a.length; _i++) {
            var child = _a[_i];
            var childSize = child.nodeSize;
            if (pos + childSize <= from) {
                // Child is entirely before the cut
                pos += childSize;
                continue;
            }
            if (pos >= actualTo) {
                // Child is entirely after the cut
                break;
            }
            // Child overlaps with the cut range
            var childFrom = Math.max(0, from - pos);
            var childTo = Math.min(childSize, actualTo - pos);
            if (childFrom === 0 && childTo === childSize) {
                // Include entire child
                result.push(child);
            }
            else {
                // Cut the child
                var cutChild = child.cut(childFrom, childTo);
                if (cutChild) {
                    result.push(cutChild);
                }
            }
            pos += childSize;
        }
        return new Fragment(result);
    };
    /**
     * Replace a range of this fragment with new content.
     */
    Fragment.prototype.replace = function (from, to, fragment) {
        var before = this.cut(0, from);
        var after = this.cut(to);
        return before.appendFragment(fragment).appendFragment(after);
    };
    /**
     * Append another fragment to this one.
     */
    Fragment.prototype.appendFragment = function (other) {
        return new Fragment(__spreadArray(__spreadArray([], this.content, true), other.content, true));
    };
    /**
     * Check if this fragment equals another fragment.
     */
    Fragment.prototype.equals = function (other) {
        if (this.content.length !== other.content.length) {
            return false;
        }
        for (var i = 0; i < this.content.length; i++) {
            if (!this.content[i].equals(other.content[i])) {
                return false;
            }
        }
        return true;
    };
    /**
     * Convert to JSON representation.
     */
    Fragment.prototype.toJSON = function () {
        return this.content.map(function (node) { return node.toJSON(); });
    };
    Object.defineProperty(Fragment.prototype, "textContent", {
        /**
         * Get the text content of this fragment.
         */
        get: function () {
            return this.content.map(function (node) { return node.textContent; }).join('');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create a string representation for debugging.
     */
    Fragment.prototype.toString = function () {
        return this.content.map(function (node) { return node.toString(); }).join('');
    };
    return Fragment;
}());
exports.Fragment = Fragment;
