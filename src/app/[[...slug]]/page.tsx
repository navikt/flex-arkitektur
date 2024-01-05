import { ReactElement } from 'react'

import { Visualisering } from '@/components/Visualisering'
import { QueryClientWrap } from '@/components/QueryClientWrap'

export default async function Docs({}: { params: { slug?: string[] } }): Promise<ReactElement> {
    return (
        <main>
            <QueryClientWrap>
                <Visualisering />
            </QueryClientWrap>
        </main>
    )
}
