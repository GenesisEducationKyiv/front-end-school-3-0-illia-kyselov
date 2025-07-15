'use client'

import { PauseIcon } from '@/icons/PauseIcon'
import { PlayIcon } from '@/icons/PlayIcon'
import { formatTime } from '@/utils/formatTime'
import { useWaveSurfer } from '@/hooks/useWaveSurfer'
import { useExclusiveAudio } from '@/hooks/useExclusiveAudio'

interface Props {
    src: string | null;
    trackId: string | number;
}

export default function CustomAudioPlayer({ src, trackId }: Props) {
    const { containerRef, playing, current, failed, toggle, stop } = useWaveSurfer(src)
    const { notifyStart } = useExclusiveAudio(trackId, playing, stop)

    const handleToggle = () => {
        if (!playing) notifyStart()
        toggle()
    }

    return (
        <div
            data-testid={`audio-player-${trackId}`}
            className="flex w-full items-center gap-2 rounded-lg border border-[rgba(39,24,100,0.5)] bg-transparent px-4 py-2"
        >
            <button
                onClick={handleToggle}
                disabled={failed}
                aria-label={playing ? 'Pause' : 'Play'}
                className="cursor-pointer rounded-full bg-[var(--neon)] p-2 hover:opacity-90 disabled:opacity-50"
                data-testid={playing ? `pause-button-${trackId}` : `play-button-${trackId}`}
            >
                {playing ? <PauseIcon width={16} height={16} /> : <PlayIcon width={16} height={16} />}
            </button>

            <div
                ref={containerRef}
                data-testid={`audio-progress-${trackId}`}
                className={`h-16 flex-1 ${failed ? 'hidden' : 'cursor-pointer'}`}
            />

            <span className="text-sm text-[#bfb8e5]">
                {failed ? 'Audio not found' : formatTime(current)}
            </span>
        </div>
    )
}
