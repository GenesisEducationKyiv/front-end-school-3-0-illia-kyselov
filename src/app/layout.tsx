import './globals.css'
import { ReactNode } from 'react'
import { Providers } from '@/components/Providers'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning >
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
