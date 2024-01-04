import { ReactElement } from 'react'

export default async function Docs({}: { params: { slug?: string[] } }): Promise<ReactElement> {
    return (
        <main>
            <h1>Hello world</h1>
        </main>
    )
}
