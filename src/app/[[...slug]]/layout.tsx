import '../../styles/globals.css'
import React, { ReactElement } from 'react'

import { verifyUserLoggedIn } from '@/auth/authentication'

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<ReactElement> {
    await verifyUserLoggedIn()

    return (
        <html lang="en">
            <head>
                <title>Flex arkitektur</title>
                <meta name="robots" content="noindex" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/@fortawesome/fontawesome-free@6.4.2/css/v4-font-face.css"
                />
            </head>
            <body>
                <div className="flex-1 mx-auto h-screen">
                    <main>{children}</main>
                </div>
            </body>
        </html>
    )
}
