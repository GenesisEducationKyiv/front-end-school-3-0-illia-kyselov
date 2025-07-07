import { describe, it, expect } from 'vitest';
import { formatTime } from '@/utils/formatTime';

describe('formatTime', () => {
    it('formats 0 seconds as 0:00', () => {
        expect(formatTime(0)).toBe('0:00');
    });

    it('formats 9 seconds as 0:09', () => {
        expect(formatTime(9)).toBe('0:09');
    });

    it('formats 59 seconds as 0:59', () => {
        expect(formatTime(59)).toBe('0:59');
    });

    it('formats 60 seconds as 1:00', () => {
        expect(formatTime(60)).toBe('1:00');
    });

    it('formats 61 seconds as 1:01', () => {
        expect(formatTime(61)).toBe('1:01');
    });

    it('formats 65 seconds as 1:05', () => {
        expect(formatTime(65)).toBe('1:05');
    });

    it('formats 600 seconds as 10:00', () => {
        expect(formatTime(600)).toBe('10:00');
    });

    it('formats large values like 3600 seconds as 60:00', () => {
        expect(formatTime(3600)).toBe('60:00');
    });

    it('handles negative seconds (edge case)', () => {
        expect(formatTime(-1)).toBe('0:00');
    });
});
