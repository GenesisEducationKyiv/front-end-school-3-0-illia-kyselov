import { create } from 'zustand'

interface ActiveTrackState {
    title: string
    setTitle: (title: string) => void
}

export const useActiveTrackStore = create<ActiveTrackState>((set) => ({
    title: '',
    setTitle: (title) => set({ title }),
}))