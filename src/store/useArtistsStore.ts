import { create } from 'zustand'

interface ArtistsState {
    list: string[]
    addArtists: (newArtists: string[]) => void
    resetArtists: () => void
}

export const useArtistsStore = create<ArtistsState>((set) => ({
    list: [],
    addArtists: (newArtists) =>
        set((state) => ({
            list: Array.from(new Set([...state.list, ...newArtists])),
        })),
    resetArtists: () => set({ list: [] }),
}))
