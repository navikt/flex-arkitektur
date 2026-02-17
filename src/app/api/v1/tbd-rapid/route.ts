import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { isLocalOrDemo } from '@/utlis/env'
import { PrometheusResponse } from '@/types'

// Cache for consumers data
let cachedPrometheusResponse: PrometheusResponse | undefined = undefined
let lastConsumersFetchTime = 0

// Prometheus query URL
const PROMETHEUS_URL =
    'https://prometheus.prod.nav.cloud.nais.io/api/v1/query?query=count+by+%28app%2C+namespace%2C+event_name%2C+river%2C+behov%2C+losninger%2C+participating_services%29+%28%0A++increase%28message_counter_total%7Brapid%3D%22tbd.rapid.v1%22%2C+validated%3D%22ok%22%2C+event_name%3D%7E%22.%2B%22%7D%5B48h%5D%29+%3E+0%0A%29'

async function fetchConsumersFromPrometheus(): Promise<PrometheusResponse> {
    try {
        const response = await fetch(PROMETHEUS_URL)
        if (!response.ok) {
            throw new Error(`Prometheus API returned ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        logger.error(`Failed to fetch consumers from Prometheus: ${error}`)
        throw error
    }
}

async function getPrometheusData(): Promise<PrometheusResponse> {
    const currentTime = Date.now()
    const cacheTimer = 6 // 6 hours like naisapper

    // Use test data in local development
    if (isLocalOrDemo && process.env.LOCAL_TESTDATA === 'true') {
        logger.info('Using test data for consumers in development mode')
        return testConsumers
    }

    // Check cache
    if (!cachedPrometheusResponse || currentTime - lastConsumersFetchTime > 3600000 * cacheTimer) {
        logger.info('Fetching data from Prometheus')
        cachedPrometheusResponse = await fetchConsumersFromPrometheus()
        lastConsumersFetchTime = currentTime
    } else {
        logger.info('Using cached consumers data')
    }

    return cachedPrometheusResponse
}

export async function GET(): Promise<NextResponse<PrometheusResponse | { error: string }>> {
    try {
        const data = await getPrometheusData()

        const nextResponse = NextResponse.json(data)
        nextResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300')

        return nextResponse
    } catch (error) {
        logger.error(`Error in tbd-rapid API: ${error}`)
        return NextResponse.json({ error: 'Failed to fetch rapid data' }, { status: 500 })
    }
}

const testConsumers: PrometheusResponse = {
    status: 'success',
    data: {
        resultType: 'vector',
        result: [
            {
                metric: {
                    app: 'behovsakkumulator',
                    behov: 'ArbeidsavklaringspengerV2,DagpengerV2,Foreldrepenger,InntekterForBeregning,Institusjonsopphold,Omsorgspenger,Opplæringspenger,Pleiepenger',
                    event_name: 'behov',
                    losninger: 'ArbeidsavklaringspengerV2',
                    namespace: 'tbd',
                    participating_services: 'spleis,sparkel-aap,sparkel-aap,behovsakkumulator',
                    river: 'Behovsakkumulator',
                },
                value: [1771320492.65, '4'],
            },
            {
                metric: {
                    app: 'spesialist',
                    behov: 'none',
                    event_name: 'avsluttet_med_vedtak',
                    losninger: 'none',
                    namespace: 'tbd',
                    participating_services: 'spleis,spesialist',
                    river: 'RiverSetup$$Lambda/0x00007d346083eb48',
                },
                value: [1771320868.034, '1'],
            },
            {
                metric: {
                    app: 'spesialist',
                    behov: 'none',
                    event_name: 'avsluttet_uten_vedtak',
                    losninger: 'none',
                    namespace: 'tbd',
                    participating_services: 'spleis,spesialist',
                    river: 'AvsluttetUtenVedtakRiver',
                },
                value: [1771320868.034, '23'],
            },
            {
                metric: {
                    app: 'spesialist',
                    behov: 'none',
                    event_name: 'behandling_opprettet',
                    losninger: 'none',
                    namespace: 'tbd',
                    participating_services: 'spleis,spesialist',
                    river: 'RiverSetup$$Lambda/0x0000785b848559a8',
                },
                value: [1771320868.034, '1'],
            },
        ],
    },
}
