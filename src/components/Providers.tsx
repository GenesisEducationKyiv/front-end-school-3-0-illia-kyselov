'use client'

import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <div data-testid="toast-container">
                <Toaster
                    toastOptions={{ style: { background: '#1e1e1e', color: '#fff' } }}
                />
            </div>
            {children}
        </Provider>
    )
}
