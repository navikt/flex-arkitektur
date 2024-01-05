import '../../styles/globals.css'
import { ReactElement } from 'react'

import { verifyUserLoggedIn } from '@/auth/authentication'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
    params: { slug?: string[] }
}): Promise<ReactElement> {
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
            </head>
            <body>
                <div className="flex-1 mx-auto h-screen">
                    <main>{children}</main>
                </div>
            </body>
        </html>
    )
}
