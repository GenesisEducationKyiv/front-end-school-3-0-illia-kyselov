import { useEffect } from 'react'
import { useActiveTrackStore } from '@/store/zustand/activeTrackStore'

export function useActiveTrackWS() {
    const setTitle = useActiveTrackStore(s => s.setTitle)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws')

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                if (data.type === 'ACTIVE_TRACK' && data.payload && typeof data.payload.title === 'string') {
                    setTitle(data.payload.title)
                }
            } catch { }
        }

        return () => ws.close()
    }, [setTitle])
}
