"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSchema = exports.Schema = void 0;
var Node_1 = require("../model/Node");
var Mark_1 = require("../model/Mark");
/**
 * Schema defines the structure and types allowed in a document.
 * It contains specifications for all node and mark types.
 */
var Schema = /** @class */ (function () {
    function Schema(spec) {
        this.spec = spec;
        this.nodes = this.createNodeTypes(spec.nodes);
        this.marks = this.createMarkTypes(spec.marks, this);
    }
    /**
     * Create node types from specifications.
     */
    Schema.prototype.createNodeTypes = function (nodeSpecs) {
        var nodes = {};
        for (var _i = 0, _a = Object.entries(nodeSpecs); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], spec = _b[1];
            nodes[name_1] = new Node_1.NodeType(name_1, spec, this);
        }
        return nodes;
    };
    /**
     * Create mark types from specifications.
     */
    Schema.prototype.createMarkTypes = function (markSpecs, schema) {
        var marks = {};
        for (var _i = 0, _a = Object.entries(markSpecs); _i < _a.length; _i++) {
            var _b = _a[_i], name_2 = _b[0], spec = _b[1];
            marks[name_2] = new Mark_1.MarkType(name_2, spec, schema);
        }
        return marks;
    };
    /**
     * Check if a node type is allowed as a child of another node type.
     */
    Schema.prototype.allowsNodeType = function (parentType, childType) {
        var content = parentType.spec.content;
        if (!content)
            return false;
        // Parse content expression (simplified)
        // This would need more sophisticated parsing for complex expressions
        var allowedTypes = content.split(/\s+/);
        return allowedTypes.some(function (type) {
            if (type === 'text')
                return childType.isText;
            if (type === 'inline')
                return childType.isInline;
            if (type === 'block')
                return childType.isBlock;
            return childType.name === type;
        });
    };
    Object.defineProperty(Schema.prototype, "text", {
        /**
         * Get the text node type.
         */
        get: function () {
            return this.nodes.text;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "doc", {
        /**
         * Get the document node type.
         */
        get: function () {
            return this.nodes.doc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Schema.prototype, "paragraph", {
        /**
         * Get the paragraph node type.
         */
        get: function () {
            return this.nodes.paragraph;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Convert to JSON representation.
     */
    Schema.prototype.toJSON = function () {
        return this.spec;
    };
    return Schema;
}());
exports.Schema = Schema;
/**
 * Default schema with basic node and mark types.
 */
exports.defaultSchema = new Schema({
    nodes: {
        doc: {
            content: 'block+'
        },
        paragraph: {
            content: 'inline*',
            group: 'block',
            parseDOM: [{ tag: 'p' }],
            toDOM: function () { return ['p', 0]; }
        },
        heading: {
            attrs: {
                level: { default: 1, validate: function (value) { return value >= 1 && value <= 6; } }
            },
            content: 'inline*',
            group: 'block',
            defining: true,
            parseDOM: [
                { tag: 'h1', attrs: { level: 1 } },
                { tag: 'h2', attrs: { level: 2 } },
                { tag: 'h3', attrs: { level: 3 } },
                { tag: 'h4', attrs: { level: 4 } },
                { tag: 'h5', attrs: { level: 5 } },
                { tag: 'h6', attrs: { level: 6 } }
            ],
            toDOM: function (node) { return ["h".concat(node.attrs.level), 0]; }
        },
        text: {
            group: 'inline',
            isText: true
        }
    },
    marks: {
        bold: {
            parseDOM: [
                { tag: 'strong' },
                { tag: 'b', getAttrs: function (node) { return typeof node === 'string' ? null : node.style.fontWeight !== 'normal' && null; } },
                { style: 'font-weight=400', clearMark: function (m) { return m.type.name === 'strong'; } },
                { style: 'font-weight', getAttrs: function (value) { return typeof value === 'string' && /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null; } }
            ],
            toDOM: function () { return ['strong', 0]; }
        },
        italic: {
            parseDOM: [
                { tag: 'i' },
                { tag: 'em' },
                { style: 'font-style=italic' }
            ],
            toDOM: function () { return ['em', 0]; }
        },
        underline: {
            parseDOM: [
                { tag: 'u' },
                { style: 'text-decoration=underline' }
            ],
            toDOM: function () { return ['u', 0]; }
        }
    }
});
