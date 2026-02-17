import { useQuery } from '@tanstack/react-query'

import { PrometheusResponse } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'

export function useTbdRapidData(): ReturnType<typeof useQuery<PrometheusResponse, Error>> {
    return useQuery<PrometheusResponse, Error>({
        queryKey: ['tbd-rapid'],
        queryFn: async () => {
            return await fetchJsonMedRequestId('/api/v1/tbd-rapid')
        },
    })
}
