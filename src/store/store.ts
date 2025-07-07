import { configureStore } from '@reduxjs/toolkit'
import { tracksApi } from './services/tracksApi'

export const store = configureStore({
    reducer: {
        [tracksApi.reducerPath]: tracksApi.reducer,
    },
    middleware: (getDefault) =>
        getDefault().concat(tracksApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
