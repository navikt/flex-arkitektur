import { ReactElement } from 'react'

import { QueryClientWrap } from '@/components/QueryClientWrap'
import { PoHelse } from '@/components/PoHelse'

export default async function Docs(): Promise<ReactElement> {
    return (
        <QueryClientWrap>
            <PoHelse />
        </QueryClientWrap>
    )
}
