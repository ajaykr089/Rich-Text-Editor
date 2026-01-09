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
exports.MarkType = exports.Mark = void 0;
/**
 * A mark represents inline formatting like bold, italic, links, etc.
 * Marks can be applied to text nodes and can span multiple characters.
 */
var Mark = /** @class */ (function () {
    function Mark(type, attrs) {
        if (attrs === void 0) { attrs = {}; }
        this.type = type;
        this.attrs = attrs;
    }
    /**
     * Create a mark from a MarkType.
     */
    Mark.create = function (type, attrs) {
        if (attrs === void 0) { attrs = {}; }
        return new Mark(type, attrs);
    };
    /**
     * Create a mark from JSON representation.
     */
    Mark.fromJSON = function (schema, json) {
        var type = schema.marks[json.type];
        if (!type) {
            throw new Error("Unknown mark type: ".concat(json.type));
        }
        var attrs = json.attrs || {};
        return new Mark(type, attrs);
    };
    /**
     * Check if this mark is in a set of marks.
     */
    Mark.prototype.isInSet = function (marks) {
        for (var _i = 0, marks_1 = marks; _i < marks_1.length; _i++) {
            var mark = marks_1[_i];
            if (mark.type === this.type && this.attrsEqual(mark.attrs)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Add this mark to a set of marks.
     */
    Mark.prototype.addToSet = function (marks) {
        var _this = this;
        if (this.isInSet(marks)) {
            return marks;
        }
        // Check if this mark excludes any existing marks
        var filtered = marks.filter(function (mark) { return !_this.type.excludes(mark.type); });
        return __spreadArray(__spreadArray([], filtered, true), [this], false);
    };
    /**
     * Remove this mark from a set of marks.
     */
    Mark.prototype.removeFromSet = function (marks) {
        var _this = this;
        return marks.filter(function (mark) { return !(mark.type === _this.type && _this.attrsEqual(mark.attrs)); });
    };
    /**
     * Check if attributes are equal.
     */
    Mark.prototype.attrsEqual = function (otherAttrs) {
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
     * Check if this mark equals another mark.
     */
    Mark.prototype.equals = function (other) {
        return this.type === other.type && this.attrsEqual(other.attrs);
    };
    /**
     * Convert to JSON representation.
     */
    Mark.prototype.toJSON = function () {
        var result = {
            type: this.type.name,
        };
        if (Object.keys(this.attrs).length > 0) {
            result.attrs = this.attrs;
        }
        return result;
    };
    /**
     * Create a string representation for debugging.
     */
    Mark.prototype.toString = function () {
        var attrs = Object.keys(this.attrs).length > 0
            ? "(".concat(Object.entries(this.attrs).map(function (_a) {
                var k = _a[0], v = _a[1];
                return "".concat(k, "=").concat(v);
            }).join(', '), ")")
            : '';
        return "<".concat(this.type.name).concat(attrs, ">");
    };
    return Mark;
}());
exports.Mark = Mark;
/**
 * Mark type definition with specifications.
 */
var MarkType = /** @class */ (function () {
    function MarkType(name, spec, schema) {
        this.name = name;
        this.spec = spec;
        this.schema = schema;
    }
    /**
     * Check if this mark type excludes another mark type.
     */
    MarkType.prototype.excludes = function (other) {
        var excludes = this.spec.excludes;
        if (excludes) {
            if (typeof excludes === 'string') {
                return excludes === other.name || excludes === (other.spec.group || '');
            }
            return excludes.includes(other.name) || excludes.includes(other.spec.group || '');
        }
        return false;
    };
    /**
     * Create a mark of this type.
     */
    MarkType.prototype.create = function (attrs) {
        if (attrs === void 0) { attrs = {}; }
        return Mark.create(this, attrs);
    };
    /**
     * Check if this mark is active in a set of marks.
     */
    MarkType.prototype.isInSet = function (marks) {
        for (var _i = 0, marks_2 = marks; _i < marks_2.length; _i++) {
            var mark = marks_2[_i];
            if (mark.type === this) {
                return true;
            }
        }
        return false;
    };
    return MarkType;
}());
exports.MarkType = MarkType;
