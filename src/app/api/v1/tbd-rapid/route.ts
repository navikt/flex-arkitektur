import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { TbdRapidData, RapidEvent } from '@/types'
import { isLocalOrDemo } from '@/utlis/env'

// Cache for consumers data
let cachedConsumers: RapidEvent[] | undefined = undefined
let lastConsumersFetchTime = 0

// Prometheus query URL
const PROMETHEUS_URL =
    'https://prometheus.prod.nav.cloud.nais.io/api/v1/query?query=count+by+%28app%2C+namespace%2C+event_name%2C+river%29+%28%0A++increase%28message_counter_total%7Brapid%3D%22tbd.rapid.v1%22%2C+validated%3D%22ok%22%7D%5B48h%5D%29+%3E+0%0A%29'

interface PrometheusResponse {
    status: string
    data: {
        resultType: string
        result: Array<{
            metric: {
                app: string
                namespace: string
                event_name: string
                river?: string
            }
            value: [number, string]
        }>
    }
}

async function fetchConsumersFromPrometheus(): Promise<RapidEvent[]> {
    try {
        const response = await fetch(PROMETHEUS_URL)
        if (!response.ok) {
            throw new Error(`Prometheus API returned ${response.status}`)
        }

        const data: PrometheusResponse = await response.json()

        return data.data.result.map((event) => ({
            app: event.metric.app,
            namespace: event.metric.namespace,
            event_name: event.metric.event_name,
        }))
    } catch (error) {
        logger.error(`Failed to fetch consumers from Prometheus: ${error}`)
        throw error
    }
}

async function getConsumers(): Promise<RapidEvent[]> {
    const currentTime = Date.now()
    const cacheTimer = 6 // 6 hours like naisapper

    // Use test data in local development
    if (isLocalOrDemo && process.env.LOCAL_TESTDATA === 'true') {
        logger.info('Using test data for consumers in development mode')
        return testConsumers.data.result.map((event) => ({
            app: event.metric.app,
            namespace: event.metric.namespace,
            event_name: event.metric.event_name,
        }))
    }

    // Check cache
    if (!cachedConsumers || currentTime - lastConsumersFetchTime > 3600000 * cacheTimer) {
        logger.info('Fetching consumers from Prometheus')
        cachedConsumers = await fetchConsumersFromPrometheus()
        lastConsumersFetchTime = currentTime
    } else {
        logger.info('Using cached consumers data')
    }

    return cachedConsumers
}

export async function GET(): Promise<NextResponse<TbdRapidData | { error: string }>> {
    try {
        const consumers = await getConsumers()

        const data: TbdRapidData = {
            consumers,
            producers: [
                // mock data, må erstattes med faktisk data fra repoene eller helst prometheus
                ...spesialistEvents.map((event) => ({
                    app: 'spesialist',
                    namespace: 'tbd',
                    event_name: event,
                })),
                ...spleisEvents.map((event) => ({
                    app: 'spleis',
                    namespace: 'tbd',
                    event_name: event,
                })),
            ],
        }

        const nextResponse = NextResponse.json(data)
        nextResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300')

        return nextResponse
    } catch (error) {
        logger.error(`Error in tbd-rapid API: ${error}`)
        return NextResponse.json({ error: 'Failed to fetch rapid data' }, { status: 500 })
    }
}

const spleisEvents = [
    'aktivitetslogg_ny_aktivitet',
    'analytisk_datapakke',
    'avsluttet_med_vedtak',
    'avsluttet_uten_vedtak',
    'behandling_forkastet',
    'behandling_lukket',
    'behandling_opprettet',
    'behov',
    'benyttet_grunnlagsdata_for_beregning',
    'feriepenger_utbetalt',
    'inntektsmelding_før_søknad',
    'inntektsmelding_håndtert',
    'inntektsmelding_ikke_håndtert',
    'overlappende_infotrygdperioder',
    'overstyring_igangsatt',
    'planlagt_annullering',
    'skatteinntekter_lagt_til_grunn',
    'sykefraværstilfelle_ikke_funnet',
    'søknad_håndtert',
    'trenger_inntektsmelding_replay',
    'trenger_ikke_opplysninger_fra_arbeidsgiver',
    'trenger_opplysninger_fra_arbeidsgiver',
    'utbetaling_annullert',
    'utbetaling_endret',
    'utbetaling_utbetalt',
    'utbetaling_uten_utbetaling',
    'utkast_til_vedtak',
    'vedtaksperiode_annullert',
    'vedtaksperiode_endret',
    'vedtaksperiode_forkastet',
    'vedtaksperiode_ikke_påminnet',
    'vedtaksperiode_ny_utbetaling',
    'vedtaksperiode_opprettet',
    'vedtaksperiode_påminnet',
    'vedtaksperioder_venter',
]

const spesialistEvents = [
    'vedtaksperiode_avvist',
    'vedtaksperiode_godkjent',
    'behov',
    'vedtak_fattet',
    'klargjør_person_for_visning',
    'oppdater_persondata',
    'hent-dokument',
    'oppgave_opprettet',
    'oppgave_oppdatert',
    'annullering',
    'lagt_på_vent',
    'minimum_sykdomsgrad_vurdert',
    'overstyr_arbeidsforhold',
    'overstyr_inntekt_og_refusjon',
    'overstyr_tidslinje',
    'skjønnsmessig_fastsettelse',
    'varsel_endret',
    'inntektsendringer',
    'kommandokjede_ferdigstilt',
    'kommandokjede_suspendert',
    'kommandokjede_avbrutt',
    'subsumsjon',
]

const testConsumers = {
    status: 'success',
    data: {
        resultType: 'vector',
        result: [
            {
                metric: {
                    app: 'behovsakkumulator',
                    event_name: 'ping',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '4'],
            },
            {
                metric: {
                    app: 'behovsakkumulator',
                    event_name: 'ukjent',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '4'],
            },
            {
                metric: {
                    app: 'dataprodukt-annulleringer',
                    event_name: 'ping',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '1'],
            },
            {
                metric: {
                    app: 'dataprodukt-annulleringer',
                    event_name: 'utbetaling_endret',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '1'],
            },
            {
                metric: {
                    app: 'dataprodukt-annulleringer',
                    event_name: 'vedtak_fattet',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '1'],
            },
            {
                metric: {
                    app: 'dataprodukt-forstegangsbehandling',
                    event_name: 'ping',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '1'],
            },
            {
                metric: {
                    app: 'dataprodukt-forstegangsbehandling',
                    event_name: 'sendt_søknad_nav',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '1'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'arbeidsgiveropplysninger',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'behov',
                    namespace: 'risk',
                },
                value: [1770669637.611, '9'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'inntektsmelding',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'korrigerte_arbeidsgiveropplysninger',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'ny_søknad',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'oppgave_oppdatert',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'selvbestemte_arbeidsgiveropplysninger',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'sendt_søknad_arbeidsgiver',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'sendt_søknad_nav',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'sendt_søknad_selvstendig',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'helserisk-treskeverk',
                    event_name: 'vedtaksperiode_endret',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'sigmund',
                    event_name: 'behov',
                    namespace: 'risk',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'aktivitetslogg_ny_aktivitet',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '188'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'analytisk_datapakke',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '63'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'annullering',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '1'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'halv_time',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '2'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'inntektsmelding_håndtert',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '52'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'lagt_på_vent',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '3'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'oppgave_oppdatert',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '56'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'oppgave_opprettet',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '70'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'overstyring_igangsatt',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '23'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'person_avstemt',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '20'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'ping',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '94'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'revurdering_ferdigstilt',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '67'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'sendt_søknad_arbeidsgiver',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '69'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'sendt_søknad_arbeidsledig',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '16'],
            },
            {
                metric: {
                    app: 'spaghet',
                    event_name: 'sendt_søknad_nav',
                    namespace: 'tbd',
                },
                value: [1770669637.611, '76'],
            },
        ],
    },
}
