import { ReactElement } from 'react'

import { Arkitektur } from '@/components/Arkitektur'
import { QueryClientWrap } from '@/components/QueryClientWrap'

export default async function Docs({}: { params: { slug?: string[] } }): Promise<ReactElement> {
    return (
        <QueryClientWrap>
            <Arkitektur />
        </QueryClientWrap>
    )
}
