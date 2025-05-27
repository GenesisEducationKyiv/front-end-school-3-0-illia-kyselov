import { configureStore } from '@reduxjs/toolkit'
import { tracksApi } from './services/tracksApi'
import artistsReducer from './slices/artistsSlice'

export const store = configureStore({
    reducer: {
        [tracksApi.reducerPath]: tracksApi.reducer,
        artists: artistsReducer,
    },
    middleware: (getDefault) =>
        getDefault().concat(tracksApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
