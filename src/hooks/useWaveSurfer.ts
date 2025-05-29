'use client'

import { useEffect, useRef, useState, MutableRefObject } from 'react'
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js'

export interface UseWaveSurferReturn {
    containerRef: MutableRefObject<HTMLDivElement | null>
    playing: boolean
    current: number
    failed: boolean
    toggle: () => void
    stop: () => void
}

export function useWaveSurfer(src: string | null): UseWaveSurferReturn {
    const containerRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WaveSurfer | null>(null)

    const [playing, setPlaying] = useState(false)
    const [current, setCurrent] = useState(0)
    const [failed, setFailed] = useState(!src)

    useEffect(() => {
        if (!src) {
            setFailed(true)
            return
        }

        let cancelled = false

        fetch(src, { method: 'HEAD' })
            .then(r => {
                if (!r.ok) throw new Error()
                if (cancelled || !containerRef.current) return

                const opts: WaveSurferOptions = {
                    container: containerRef.current,
                    waveColor: '#271864',
                    progressColor: '#2b046a',
                    height: 60,
                }

                const ws = WaveSurfer.create(opts)
                wsRef.current = ws

                ws.load(src)
                ws.on('timeupdate', (t: number) => setCurrent(t))
                ws.on('finish', () => {
                    stop()
                    setCurrent(0)
                })
                ws.on('error', () => setFailed(true))
            })
            .catch(() => setFailed(true))

        return () => {
            cancelled = true
            wsRef.current?.destroy()
            wsRef.current = null
        }
    }, [src])

    const toggle = () => {
        if (failed) return
        wsRef.current?.playPause()
        setPlaying(p => !p)
    }

    const stop = () => {
        wsRef.current?.pause()
        wsRef.current?.seekTo(0)
        setPlaying(false)
    }

    return { containerRef, playing, current, failed, toggle, stop }
}
