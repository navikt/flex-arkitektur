import { useQuery } from '@tanstack/react-query'

import { TbdRapidData } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'

export function useTbdRapidData(): ReturnType<typeof useQuery<TbdRapidData, Error>> {
    return useQuery<TbdRapidData, Error>({
        queryKey: ['tbd-rapid'],
        queryFn: async () => {
            return await fetchJsonMedRequestId('/api/v1/tbd-rapid')
        },
    })
}
