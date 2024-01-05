'use client'
import { ReactElement } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseAsArrayOf, parseAsString, useQueryState } from 'next-usequerystate'
import { Alert } from '@navikt/ds-react'

import { NaisApp } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'

export const Visualisering = (): ReactElement => {
    const [env] = useQueryState('env', parseAsString.withDefault('prod'))

    const [namespace] = useQueryState('namespace', parseAsArrayOf(parseAsString).withDefault(['flex']))
    const { data, error, isFetching } = useQuery<NaisApp[], Error>({
        queryKey: [`nais-apper`, env],
        queryFn: async () => {
            const url = `/api/v1/naisapper?env=${env}`

            return await fetchJsonMedRequestId(url)
        },
    })
    if (!data || isFetching) {
        return <h2>Loading...</h2>
    }
    if (error) {
        return <Alert variant="error">Kunne ikke hente data fra api</Alert>
    }

    return (
        <>
            {data
                .filter((app) => namespace.includes(app.namespace))
                .map((app) => (
                    <div key={app.name}>
                        <h2>{app.name}</h2>
                    </div>
                ))}
        </>
    )
}
