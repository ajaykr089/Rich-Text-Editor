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
exports.defaultSanitizer = exports.ContentValidator = exports.Sanitizer = void 0;
exports.createSanitizer = createSanitizer;
/**
 * HTML sanitizer for cleaning user input.
 */
var Sanitizer = /** @class */ (function () {
    function Sanitizer(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        this.config = __assign({ allowedTags: [
                'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 'tr', 'td', 'th'
            ], allowedAttributes: {
                'a': ['href', 'title', 'target'],
                'img': ['src', 'alt', 'title', 'width', 'height'],
                'td': ['colspan', 'rowspan'],
                'th': ['colspan', 'rowspan'],
                '*': ['class', 'style']
            }, allowDataUrls: false, maxUrlLength: 2048, urlValidator: function (url) { return _this.defaultUrlValidator(url); } }, config);
    }
    /**
     * Sanitize HTML content.
     */
    Sanitizer.prototype.sanitize = function (html) {
        // Create a temporary DOM element to parse HTML
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        // Sanitize the document
        this.sanitizeElement(doc.body);
        // Return the sanitized HTML
        return doc.body.innerHTML;
    };
    /**
     * Sanitize a DOM element recursively.
     */
    Sanitizer.prototype.sanitizeElement = function (element) {
        var children = Array.from(element.children);
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            if (this.isAllowedTag(child.tagName.toLowerCase())) {
                // Sanitize attributes
                this.sanitizeAttributes(child);
                // Recursively sanitize children
                this.sanitizeElement(child);
            }
            else {
                // Remove disallowed elements
                element.removeChild(child);
            }
        }
    };
    /**
     * Check if a tag is allowed.
     */
    Sanitizer.prototype.isAllowedTag = function (tagName) {
        return this.config.allowedTags.includes(tagName.toLowerCase());
    };
    /**
     * Sanitize element attributes.
     */
    Sanitizer.prototype.sanitizeAttributes = function (element) {
        var attributes = Array.from(element.attributes);
        var tagName = element.tagName.toLowerCase();
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attr = attributes_1[_i];
            var attrName = attr.name.toLowerCase();
            // Check if attribute is allowed for this tag
            var allowedForTag = this.config.allowedAttributes[tagName] || [];
            var allowedForAll = this.config.allowedAttributes['*'] || [];
            if (!allowedForTag.includes(attrName) && !allowedForAll.includes(attrName)) {
                element.removeAttribute(attr.name);
                continue;
            }
            // Special validation for URLs
            if (attrName === 'href' || attrName === 'src') {
                if (!this.isValidUrl(attr.value)) {
                    element.removeAttribute(attr.name);
                }
            }
        }
    };
    /**
     * Validate a URL.
     */
    Sanitizer.prototype.isValidUrl = function (url) {
        // Check length
        if (url.length > this.config.maxUrlLength) {
            return false;
        }
        // Check for data URLs
        if (url.startsWith('data:') && !this.config.allowDataUrls) {
            return false;
        }
        // Use custom validator
        return this.config.urlValidator(url);
    };
    /**
     * Default URL validator.
     */
    Sanitizer.prototype.defaultUrlValidator = function (url) {
        try {
            // Allow relative URLs
            if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
                return true;
            }
            // Allow mailto and tel URLs
            if (url.startsWith('mailto:') || url.startsWith('tel:')) {
                return true;
            }
            // Validate absolute URLs
            var parsedUrl = new URL(url);
            // Only allow http and https protocols
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                return false;
            }
            // Basic domain validation (no IP addresses that could be malicious)
            var hostname = parsedUrl.hostname;
            if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
                // Allow localhost for development
                return hostname === 'localhost' || hostname === '127.0.0.1';
            }
            return true;
        }
        catch (_a) {
            // Invalid URL format
            return false;
        }
    };
    return Sanitizer;
}());
exports.Sanitizer = Sanitizer;
/**
 * Content validator for editor input.
 */
var ContentValidator = /** @class */ (function () {
    function ContentValidator() {
    }
    /**
     * Validate text content for potential security issues.
     */
    ContentValidator.validateText = function (text) {
        var warnings = [];
        // Check for suspicious patterns
        if (text.includes('<script') || text.includes('javascript:')) {
            warnings.push('Potential XSS attempt detected');
        }
        // Check for very long words (potential DoS)
        var words = text.split(/\s+/);
        var longWords = words.filter(function (word) { return word.length > 1000; });
        if (longWords.length > 0) {
            warnings.push('Extremely long words detected');
        }
        // Check for excessive nesting (potential DoS)
        var nestingLevel = this.calculateNestingLevel(text);
        if (nestingLevel > 50) {
            warnings.push('Excessive element nesting detected');
        }
        return {
            valid: warnings.length === 0,
            warnings: warnings
        };
    };
    /**
     * Calculate maximum nesting level in HTML.
     */
    ContentValidator.calculateNestingLevel = function (html) {
        var maxDepth = 0;
        var currentDepth = 0;
        // Simple regex to count opening/closing tags
        var tagRegex = /<\/?[a-zA-Z][^>]*>/g;
        var match;
        while ((match = tagRegex.exec(html)) !== null) {
            var tag = match[0];
            if (tag.startsWith('</')) {
                currentDepth = Math.max(0, currentDepth - 1);
            }
            else if (!tag.endsWith('/>') && !tag.includes('br') && !tag.includes('img') && !tag.includes('input')) {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            }
        }
        return maxDepth;
    };
    /**
     * Validate file upload.
     */
    ContentValidator.validateFile = function (file, options) {
        if (options === void 0) { options = {}; }
        var _a = options.maxSize, maxSize = _a === void 0 ? 10 * 1024 * 1024 : _a, _b = options.allowedTypes, allowedTypes = _b === void 0 ? [] : _b, _c = options.allowEmpty, allowEmpty = _c === void 0 ? true : _c;
        if (!allowEmpty && file.size === 0) {
            return { valid: false, error: 'File is empty' };
        }
        if (file.size > maxSize) {
            return { valid: false, error: "File size exceeds ".concat(maxSize, " bytes") };
        }
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            return { valid: false, error: "File type ".concat(file.type, " not allowed") };
        }
        return { valid: true };
    };
    return ContentValidator;
}());
exports.ContentValidator = ContentValidator;
/**
 * Create a sanitizer instance.
 */
function createSanitizer(config) {
    return new Sanitizer(config);
}
/**
 * Default sanitizer instance.
 */
exports.defaultSanitizer = new Sanitizer();
