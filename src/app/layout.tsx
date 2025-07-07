import './globals.css'
import { ReactNode } from 'react'
import { Providers } from '@/components/Providers'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>Front End School 3.0</title>
                <meta name="description" content="Learn advanced front-end development in Front End School 3.0 – React, TypeScript, performance, and more." />
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body suppressHydrationWarning >
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}