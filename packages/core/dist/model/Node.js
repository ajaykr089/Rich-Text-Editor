"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = exports.Node = void 0;
var Fragment_1 = require("./Fragment");
var Mark_1 = require("./Mark");
/**
 * A node in the document tree.
 * Nodes can be either block nodes (like paragraphs, headings) or inline nodes (like text).
 */
var Node = /** @class */ (function () {
    function Node(type, attrs, content, marks) {
        if (attrs === void 0) { attrs = {}; }
        if (marks === void 0) { marks = []; }
        this.type = type;
        this.attrs = attrs;
        this.content = content || Fragment_1.Fragment.from([]);
        this.marks = marks;
        // Validate node structure
        this.validate();
    }
    /**
     * Create a node from a NodeType.
     */
    Node.create = function (type, attrs, content, marks) {
        if (attrs === void 0) { attrs = {}; }
        if (marks === void 0) { marks = []; }
        return new Node(type, attrs, content, marks);
    };
    /**
     * Create a text node.
     */
    Node.text = function (text, marks) {
        if (marks === void 0) { marks = []; }
        // This requires access to schema, so we'll create a simple implementation
        var textNode = new Node({ name: 'text', isText: true }, // Simplified NodeType
        { text: text }, undefined, marks);
        return textNode;
    };
    /**
     * Create a node from JSON representation.
     */
    Node.fromJSON = function (schema, json) {
        var type = schema.nodes[json.type];
        if (!type) {
            throw new Error("Unknown node type: ".concat(json.type));
        }
        var attrs = json.attrs || {};
        var content = json.content ? Fragment_1.Fragment.fromJSON(schema, json.content) : undefined;
        var marks = (json.marks || []).map(function (markJSON) { return Mark_1.Mark.fromJSON(schema, markJSON); });
        return new Node(type, attrs, content, marks);
    };
    /**
     * Validate that this node conforms to its type specification.
     */
    Node.prototype.validate = function () {
        var _a;
        // Basic validation - more comprehensive validation would be implemented
        if (this.type.isBlock && this.content.size === 0 && !((_a = this.type.spec.content) === null || _a === void 0 ? void 0 : _a.includes('empty'))) {
            // Allow empty blocks for now
        }
    };
    Object.defineProperty(Node.prototype, "isBlock", {
        /**
         * Check if this is a block node.
         */
        get: function () {
            return this.type.isBlock;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isInline", {
        /**
         * Check if this is an inline node.
         */
        get: function () {
            return this.type.isInline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isText", {
        /**
         * Check if this is a text node.
         */
        get: function () {
            return this.type.isText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isLeaf", {
        /**
         * Check if this is a leaf node (has no content).
         */
        get: function () {
            return this.content.childCount === 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Replace content in a range with new content.
     */
    Node.prototype.replace = function (from, to, replacement) {
        if (this.isText) {
            var text = this.attrs.text || '';
            var before = text.slice(0, from);
            var after = text.slice(to);
            var newText = before + replacement.textContent + after;
            return this.withText(newText);
        }
        var newContent = this.content.replace(from, to, replacement);
        return this.withContent(newContent);
    };
    Object.defineProperty(Node.prototype, "textContent", {
        /**
         * Get the text content of the entire document.
         */
        get: function () {
            if (this.isText) {
                return this.attrs.text || '';
            }
            var text = '';
            this.content.children.forEach(function (child) {
                text += child.textContent;
            });
            return text;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nodeSize", {
        /**
         * Get the size of this node in the document.
         */
        get: function () {
            if (this.isText) {
                return (this.attrs.text || '').length;
            }
            return 1 + this.content.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create a new node with different attributes.
     */
    Node.prototype.withAttrs = function (attrs) {
        return new Node(this.type, __assign(__assign({}, this.attrs), attrs), this.content, this.marks);
    };
    /**
     * Create a new node with different content.
     */
    Node.prototype.withContent = function (content) {
        return new Node(this.type, this.attrs, content, this.marks);
    };
    /**
     * Create a new node with different marks.
     */
    Node.prototype.withMarks = function (marks) {
        return new Node(this.type, this.attrs, this.content, marks);
    };
    /**
     * Create a new text node with different text.
     */
    Node.prototype.withText = function (text) {
        if (!this.isText) {
            throw new Error('Can only set text on text nodes');
        }
        return new Node(this.type, __assign(__assign({}, this.attrs), { text: text }), this.content, this.marks);
    };
    /**
     * Create a slice of this node's content.
     */
    Node.prototype.slice = function (from, to) {
        // For text nodes, return a fragment with the sliced text
        if (this.isText) {
            var text = this.attrs.text || '';
            var actualTo = to !== null && to !== void 0 ? to : text.length;
            var slicedText = text.slice(from, actualTo);
            if (slicedText) {
                return Fragment_1.Fragment.from([this.withText(slicedText)]);
            }
            return Fragment_1.Fragment.from([]);
        }
        // For complex nodes, this would need more sophisticated slicing
        // For now, return the entire content
        return this.content;
    };
    /**
     * Cut out a slice of this node.
     */
    Node.prototype.cut = function (from, to) {
        if (this.isText) {
            var text = this.attrs.text || '';
            var actualTo = to !== null && to !== void 0 ? to : text.length;
            if (from === 0 && actualTo === text.length) {
                return this;
            }
            var cutText = text.slice(from, actualTo);
            return cutText ? this.withText(cutText) : null;
        }
        // For non-text nodes, cutting is more complex
        // This is a simplified implementation
        if (from === 0 && (to === undefined || to >= this.nodeSize)) {
            return this;
        }
        // For now, return null for partial cuts of complex nodes
        return null;
    };
    /**
     * Get the node at a specific position within this node.
     */
    Node.prototype.nodeAt = function (pos) {
        if (pos === 0) {
            return this;
        }
        if (this.isText) {
            return pos <= (this.attrs.text || '').length ? this : null;
        }
        var child = this.content.findChildAt(pos - 1);
        if (child) {
            return child.node.nodeAt(pos - 1 - child.offset);
        }
        return null;
    };
    /**
     * Check if this node has a mark in the given range.
     */
    Node.prototype.rangeHasMark = function (from, to, markType) {
        // Simplified implementation - would need more sophisticated traversal
        if (this.isText) {
            return this.marks.some(function (mark) { return mark.type === markType; });
        }
        // Check children recursively
        for (var _i = 0, _a = this.content.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.rangeHasMark(from, to, markType)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Remove a mark from a range in this node.
     */
    Node.prototype.removeMark = function (from, to, markType) {
        if (this.isText) {
            var newMarks = this.marks.filter(function (mark) { return mark.type !== markType; });
            return this.withMarks(newMarks);
        }
        // For complex nodes, this would need recursive implementation
        return this;
    };
    /**
     * Add a mark to a range in this node.
     */
    Node.prototype.addMark = function (from, to, mark) {
        if (this.isText) {
            var newMarks = mark.addToSet(this.marks);
            return this.withMarks(newMarks);
        }
        // For complex nodes, this would need recursive implementation
        return this;
    };
    /**
     * Check if this node can be joined with another node.
     */
    Node.prototype.canJoin = function (other) {
        return this.type === other.type && this.type.spec.content === other.type.spec.content;
    };
    /**
     * Join this node with another compatible node.
     */
    Node.prototype.join = function (other) {
        if (!this.canJoin(other)) {
            throw new Error('Cannot join incompatible nodes');
        }
        if (this.isText && other.isText) {
            return this.withText(this.textContent + other.textContent);
        }
        return this.withContent(this.content.appendFragment(other.content));
    };
    /**
     * Check if this node equals another node.
     */
    Node.prototype.equals = function (other) {
        if (this.type !== other.type) {
            return false;
        }
        if (!this.attrsEqual(other.attrs)) {
            return false;
        }
        if (!this.content.equals(other.content)) {
            return false;
        }
        if (this.marks.length !== other.marks.length) {
            return false;
        }
        for (var i = 0; i < this.marks.length; i++) {
            if (!this.marks[i].equals(other.marks[i])) {
                return false;
            }
        }
        return true;
    };
    /**
     * Check if attributes are equal.
     */
    Node.prototype.attrsEqual = function (otherAttrs) {
        var keys1 = Object.keys(this.attrs);
        var keys2 = Object.keys(otherAttrs);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
            var key = keys1_1[_i];
            if (this.attrs[key] !== otherAttrs[key]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Convert to JSON representation.
     */
    Node.prototype.toJSON = function () {
        var result = {
            type: this.type.name,
        };
        if (Object.keys(this.attrs).length > 0) {
            result.attrs = this.attrs;
        }
        if (!this.content.equals(Fragment_1.Fragment.from([]))) {
            result.content = this.content.toJSON();
        }
        if (this.marks.length > 0) {
            result.marks = this.marks.map(function (mark) { return mark.toJSON(); });
        }
        return result;
    };
    /**
     * Create a string representation for debugging.
     */
    Node.prototype.toString = function () {
        if (this.isText) {
            return this.attrs.text || '';
        }
        var attrs = Object.keys(this.attrs).length > 0
            ? "(".concat(Object.entries(this.attrs).map(function (_a) {
                var k = _a[0], v = _a[1];
                return "".concat(k, "=").concat(v);
            }).join(', '), ")")
            : '';
        if (this.isLeaf) {
            return "<".concat(this.type.name).concat(attrs, " />");
        }
        var content = this.content.toString();
        return "<".concat(this.type.name).concat(attrs, ">").concat(content, "</").concat(this.type.name, ">");
    };
    // Placeholder for schema - will be set by the schema system
    Node.schema = null;
    return Node;
}());
exports.Node = Node;
/**
 * Node type definition with specifications.
 */
var NodeType = /** @class */ (function () {
    function NodeType(name, spec, schema) {
        this.name = name;
        this.spec = spec;
        this.schema = schema;
    }
    Object.defineProperty(NodeType.prototype, "isBlock", {
        /**
         * Check if this is a block node type.
         */
        get: function () {
            return !this.spec.inline && !this.spec.isText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeType.prototype, "isInline", {
        /**
         * Check if this is an inline node type.
         */
        get: function () {
            return !!this.spec.inline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeType.prototype, "isText", {
        /**
         * Check if this is a text node type.
         */
        get: function () {
            return !!this.spec.isText;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create a node of this type.
     */
    NodeType.prototype.create = function (attrs, content, marks) {
        if (attrs === void 0) { attrs = {}; }
        if (marks === void 0) { marks = []; }
        return Node.create(this, attrs, content, marks);
    };
    return NodeType;
}());
exports.NodeType = NodeType;
// Types are imported from types.ts
