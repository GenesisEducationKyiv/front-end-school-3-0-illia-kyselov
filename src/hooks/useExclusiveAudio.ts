import { useEffect } from 'react'

export function useExclusiveAudio(
    id: string | number,
    playing: boolean,
    stop: () => void,
) {
    useEffect(() => {
        const onMusicPlay = (e: Event) => {
            const otherId = (e as CustomEvent<{ id: string | number }>).detail.id
            if (otherId !== id && playing) stop()
        }

        window.addEventListener('music-play', onMusicPlay)
        return () => window.removeEventListener('music-play', onMusicPlay)
    }, [id, playing, stop])

    const notifyStart = () =>
        window.dispatchEvent(new CustomEvent('music-play', { detail: { id } }))

    return { notifyStart }
}
