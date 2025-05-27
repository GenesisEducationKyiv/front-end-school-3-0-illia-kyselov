import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ArtistsState {
    list: string[]
}

const initialState: ArtistsState = {
    list: [],
}

export const artistsSlice = createSlice({
    name: 'artists',
    initialState,
    reducers: {
        addArtists(state, action: PayloadAction<string[]>) {
            const combined = [...state.list, ...action.payload]
            state.list = Array.from(new Set(combined))
        },
    },
})

export const { addArtists } = artistsSlice.actions
export default artistsSlice.reducer
