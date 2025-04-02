import { ReactElement } from 'react'

import { Arkitektur } from '@/components/Arkitektur'
import { QueryClientWrap } from '@/components/QueryClientWrap'
import { ProdRedirect } from '@/components/ProdRedirect'

export default async function Docs(): Promise<ReactElement> {
    return (
        <QueryClientWrap>
            <ProdRedirect />
            <Arkitektur />
        </QueryClientWrap>
    )
}
