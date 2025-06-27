import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useExclusiveAudio } from '@/hooks/useExclusiveAudio';

describe('useExclusiveAudio', () => {
    it('notifies and stops others when a new track starts playing', () => {
        const stop1 = vi.fn();
        const stop2 = vi.fn();

        const track1 = renderHook(() => useExclusiveAudio('track-1', true, stop1));
        track1.result.current.notifyStart();

        const track2 = renderHook(() => useExclusiveAudio('track-2', true, stop2));
        track2.result.current.notifyStart();

        expect(stop1).toHaveBeenCalled();
        expect(stop2).not.toHaveBeenCalled();
    });

    it('does not stop if same track restarts', () => {
        const stop = vi.fn();
        const { result } = renderHook(() => useExclusiveAudio('track-1', true, stop));
        result.current.notifyStart();
        stop.mockClear();
        result.current.notifyStart();
        expect(stop).not.toHaveBeenCalled();
    });
});
