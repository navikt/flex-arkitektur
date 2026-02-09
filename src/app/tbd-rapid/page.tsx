import { ReactElement } from 'react'

import { QueryClientWrap } from '@/components/QueryClientWrap'
import { TbdRapid } from '@/components/TbdRapid'

export default async function TbdRapidPage(): Promise<ReactElement> {
    return (
        <QueryClientWrap>
            <TbdRapid />
        </QueryClientWrap>
    )
}
