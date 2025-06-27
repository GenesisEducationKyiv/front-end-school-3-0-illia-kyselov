import { describe, it, expect } from 'vitest';
import { isUrl } from '@/utils/isUrl';

describe('isUrl', () => {
    it('returns true for a valid https URL', () => {
        expect(isUrl('https://example.com')).toBe(true);
    });

    it('returns true for a valid http URL', () => {
        expect(isUrl('http://example.com')).toBe(true);
    });

    it('returns error message for a string without protocol', () => {
        expect(isUrl('example.com')).toBe('Must be valid URL');
    });

    it('returns error message for an empty string', () => {
        expect(isUrl('')).toBe('Must be valid URL');
    });

    it('returns error message for URLs without a dot', () => {
        expect(isUrl('https://localhost')).toBe('Must be valid URL');
    });

    it('returns error message for unsupported ftp protocol', () => {
        expect(isUrl('ftp://example.com')).toBe('Must be valid URL');
    });

    it('returns error message for URLs containing spaces', () => {
        expect(isUrl('http://example .com')).toBe('Must be valid URL');
    });
});
