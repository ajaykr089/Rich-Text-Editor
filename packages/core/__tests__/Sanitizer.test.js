"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var Sanitizer_1 = require("../src/security/Sanitizer");
(0, globals_1.describe)('Sanitizer', function () {
    var sanitizer;
    beforeEach(function () {
        sanitizer = new Sanitizer_1.Sanitizer();
    });
    (0, globals_1.describe)('sanitize', function () {
        (0, globals_1.it)('should remove script tags', function () {
            var input = '<p>Hello <script>alert("xss")</script>world</p>';
            var result = sanitizer.sanitize(input);
            (0, globals_1.expect)(result).not.toContain('<script>');
            (0, globals_1.expect)(result).toContain('<p>Hello world</p>');
        });
        (0, globals_1.it)('should allow safe tags', function () {
            var input = '<p><strong>Hello</strong> <em>world</em></p>';
            var result = sanitizer.sanitize(input);
            (0, globals_1.expect)(result).toBe(input);
        });
        (0, globals_1.it)('should remove dangerous attributes', function () {
            var input = '<a href="javascript:alert(1)" onclick="alert(2)">Link</a>';
            var result = sanitizer.sanitize(input);
            (0, globals_1.expect)(result).not.toContain('onclick');
            (0, globals_1.expect)(result).not.toContain('javascript:');
        });
        (0, globals_1.it)('should allow safe attributes', function () {
            var input = '<a href="https://example.com" title="Safe link">Link</a>';
            var result = sanitizer.sanitize(input);
            (0, globals_1.expect)(result).toBe(input);
        });
    });
});
(0, globals_1.describe)('ContentValidator', function () {
    (0, globals_1.describe)('validateText', function () {
        (0, globals_1.it)('should detect XSS attempts', function () {
            var result = Sanitizer_1.ContentValidator.validateText('<script>alert(1)</script>');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.warnings).toContain('Potential XSS attempt detected');
        });
        (0, globals_1.it)('should detect extremely long words', function () {
            var longWord = 'a'.repeat(1001);
            var result = Sanitizer_1.ContentValidator.validateText(longWord);
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.warnings).toContain('Extremely long words detected');
        });
        (0, globals_1.it)('should detect excessive nesting', function () {
            var deeplyNested = '<div>'.repeat(60) + 'content' + '</div>'.repeat(60);
            var result = Sanitizer_1.ContentValidator.validateText(deeplyNested);
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.warnings).toContain('Excessive element nesting detected');
        });
        (0, globals_1.it)('should pass safe content', function () {
            var result = Sanitizer_1.ContentValidator.validateText('<p>Safe content</p>');
            (0, globals_1.expect)(result.valid).toBe(true);
            (0, globals_1.expect)(result.warnings).toEqual([]);
        });
    });
    (0, globals_1.describe)('validateFile', function () {
        (0, globals_1.it)('should validate file size', function () {
            var mockFile = { size: 20 * 1024 * 1024 }; // 20MB
            var result = Sanitizer_1.ContentValidator.validateFile(mockFile, { maxSize: 10 * 1024 * 1024 });
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.error).toContain('File size exceeds');
        });
        (0, globals_1.it)('should validate file type', function () {
            var mockFile = { size: 1024, type: 'application/exe' };
            var result = Sanitizer_1.ContentValidator.validateFile(mockFile, {
                allowedTypes: ['image/jpeg', 'image/png']
            });
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.error).toContain('not allowed');
        });
        (0, globals_1.it)('should pass valid file', function () {
            var mockFile = { size: 1024, type: 'image/jpeg' };
            var result = Sanitizer_1.ContentValidator.validateFile(mockFile);
            (0, globals_1.expect)(result.valid).toBe(true);
        });
    });
});
