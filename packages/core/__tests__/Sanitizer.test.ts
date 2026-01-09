import { describe, it, expect } from '@jest/globals';
import { Sanitizer, ContentValidator } from '../src/security/Sanitizer';

describe('Sanitizer', () => {
  let sanitizer: Sanitizer;

  beforeEach(() => {
    sanitizer = new Sanitizer();
  });

  describe('sanitize', () => {
    it('should remove script tags', () => {
      const input = '<p>Hello <script>alert("xss")</script>world</p>';
      const result = sanitizer.sanitize(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Hello world</p>');
    });

    it('should allow safe tags', () => {
      const input = '<p><strong>Hello</strong> <em>world</em></p>';
      const result = sanitizer.sanitize(input);
      expect(result).toBe(input);
    });

    it('should remove dangerous attributes', () => {
      const input = '<a href="javascript:alert(1)" onclick="alert(2)">Link</a>';
      const result = sanitizer.sanitize(input);
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('javascript:');
    });

    it('should allow safe attributes', () => {
      const input = '<a href="https://example.com" title="Safe link">Link</a>';
      const result = sanitizer.sanitize(input);
      expect(result).toBe(input);
    });
  });
});

describe('ContentValidator', () => {
  describe('validateText', () => {
    it('should detect XSS attempts', () => {
      const result = ContentValidator.validateText('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
      expect(result.warnings).toContain('Potential XSS attempt detected');
    });

    it('should detect extremely long words', () => {
      const longWord = 'a'.repeat(1001);
      const result = ContentValidator.validateText(longWord);
      expect(result.valid).toBe(false);
      expect(result.warnings).toContain('Extremely long words detected');
    });

    it('should detect excessive nesting', () => {
      const deeplyNested = '<div>'.repeat(60) + 'content' + '</div>'.repeat(60);
      const result = ContentValidator.validateText(deeplyNested);
      expect(result.valid).toBe(false);
      expect(result.warnings).toContain('Excessive element nesting detected');
    });

    it('should pass safe content', () => {
      const result = ContentValidator.validateText('<p>Safe content</p>');
      expect(result.valid).toBe(true);
      expect(result.warnings).toEqual([]);
    });
  });

  describe('validateFile', () => {
    it('should validate file size', () => {
      const mockFile = { size: 20 * 1024 * 1024 } as File; // 20MB
      const result = ContentValidator.validateFile(mockFile, { maxSize: 10 * 1024 * 1024 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File size exceeds');
    });

    it('should validate file type', () => {
      const mockFile = { size: 1024, type: 'application/exe' } as File;
      const result = ContentValidator.validateFile(mockFile, {
        allowedTypes: ['image/jpeg', 'image/png']
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should pass valid file', () => {
      const mockFile = { size: 1024, type: 'image/jpeg' } as File;
      const result = ContentValidator.validateFile(mockFile);
      expect(result.valid).toBe(true);
    });
  });
});