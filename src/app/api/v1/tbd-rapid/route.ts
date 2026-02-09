import {logger} from '@navikt/next-logger'
import {NextResponse} from 'next/server'

import {hentNaisApper} from '@/bigquery/naisAppsFetching'
import {NaisApp, TbdRapidData} from '@/types'
import {verifyUserLoggedIn} from '@/auth/authentication'


export async function GET(req: Request): Promise<NextResponse<TbdRapidData>> {

    const data: TbdRapidData = {
        consumers: consumers.data.result.map((event) => ({
            app: event.metric.app,
            namespace: event.metric.namespace,
            event_name: event.metric.event_name
        })),
        producers: [ // mock data, må erstattes med faktisk data fra repoene eller helst prometheus
            ...spesialistEvents.map(
                (event) => ({
                        app: "spesialist",
                        namespace: "tbd",
                        event_name: event
                    }
                )),
            ...spleisEvents.map(
                (event) => ({
                        app: "spleis",
                        namespace: "tbd",
                        event_name: event
                    }
                ))
        ]
    }


    const nextResponse = NextResponse.json(data)
//    nextResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300')

    return nextResponse
}

const spleisEvents = [
    "aktivitetslogg_ny_aktivitet",
    "analytisk_datapakke",
    "avsluttet_med_vedtak",
    "avsluttet_uten_vedtak",
    "behandling_forkastet",
    "behandling_lukket",
    "behandling_opprettet",
    "behov",
    "benyttet_grunnlagsdata_for_beregning",
    "feriepenger_utbetalt",
    "inntektsmelding_før_søknad",
    "inntektsmelding_håndtert",
    "inntektsmelding_ikke_håndtert",
    "overlappende_infotrygdperioder",
    "overstyring_igangsatt",
    "planlagt_annullering",
    "skatteinntekter_lagt_til_grunn",
    "sykefraværstilfelle_ikke_funnet",
    "søknad_håndtert",
    "trenger_inntektsmelding_replay",
    "trenger_ikke_opplysninger_fra_arbeidsgiver",
    "trenger_opplysninger_fra_arbeidsgiver",
    "utbetaling_annullert",
    "utbetaling_endret",
    "utbetaling_utbetalt",
    "utbetaling_uten_utbetaling",
    "utkast_til_vedtak",
    "vedtaksperiode_annullert",
    "vedtaksperiode_endret",
    "vedtaksperiode_forkastet",
    "vedtaksperiode_ikke_påminnet",
    "vedtaksperiode_ny_utbetaling",
    "vedtaksperiode_opprettet",
    "vedtaksperiode_påminnet",
    "vedtaksperioder_venter"
]

const spesialistEvents = [
    "vedtaksperiode_avvist",
    "vedtaksperiode_godkjent",
    "behov",
    "vedtak_fattet",
    "klargjør_person_for_visning",
    "oppdater_persondata",
    "hent-dokument",
    "oppgave_opprettet",
    "oppgave_oppdatert",
    "annullering",
    "lagt_på_vent",
    "minimum_sykdomsgrad_vurdert",
    "overstyr_arbeidsforhold",
    "overstyr_inntekt_og_refusjon",
    "overstyr_tidslinje",
    "skjønnsmessig_fastsettelse",
    "varsel_endret",
    "inntektsendringer",
    "kommandokjede_ferdigstilt",
    "kommandokjede_suspendert",
    "kommandokjede_avbrutt",
    "subsumsjon"
]


const consumers = {
    "status": "success",
    "data": {
        "resultType": "vector",
        "result": [
            {
                "metric": {
                    "app": "behovsakkumulator",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "behovsakkumulator",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "dataprodukt-annulleringer",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "dataprodukt-annulleringer",
                    "event_name": "utbetaling_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "dataprodukt-annulleringer",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "dataprodukt-forstegangsbehandling",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "dataprodukt-forstegangsbehandling",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "arbeidsgiveropplysninger",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "behov",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "9"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "inntektsmelding",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "korrigerte_arbeidsgiveropplysninger",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "ny_søknad",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "oppgave_oppdatert",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "selvbestemte_arbeidsgiveropplysninger",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "sendt_søknad_arbeidsgiver",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "sendt_søknad_selvstendig",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "helserisk-treskeverk",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "sigmund",
                    "event_name": "behov",
                    "namespace": "risk"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "aktivitetslogg_ny_aktivitet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "188"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "analytisk_datapakke",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "63"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "annullering",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "halv_time",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "inntektsmelding_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "lagt_på_vent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "oppgave_oppdatert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "56"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "oppgave_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "70"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "overstyring_igangsatt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "23"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "person_avstemt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "20"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "94"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "revurdering_ferdigstilt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "67"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "sendt_søknad_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "sendt_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "16"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "sendt_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "14"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "skatteinntekter_lagt_til_grunn",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "søknad_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "78"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "219"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "utkast_til_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "93"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "varsel_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "32"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "225"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "vedtaksperiode_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "78"
                ]
            },
            {
                "metric": {
                    "app": "spaghet",
                    "event_name": "vedtaksperioder_venter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "94"
                ]
            },
            {
                "metric": {
                    "app": "spammer",
                    "event_name": "app_status",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spammer",
                    "event_name": "avstemming",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spammer",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spammer",
                    "event_name": "påminnelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spammer",
                    "event_name": "slackmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spare",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "12"
                ]
            },
            {
                "metric": {
                    "app": "spare",
                    "event_name": "utbetaling_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spare",
                    "event_name": "utbetaling_utbetalt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "11"
                ]
            },
            {
                "metric": {
                    "app": "spare",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "11"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-aap",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-aap",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-aareg",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-aareg",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-arbeidsgiver",
                    "event_name": "inntektsmelding_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-arbeidsgiver",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-arbeidsgiver",
                    "event_name": "trenger_ikke_opplysninger_fra_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-arbeidsgiver",
                    "event_name": "trenger_opplysninger_fra_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-arbeidsgiver",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-dagpenger",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-dagpenger",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-dokumenter",
                    "event_name": "hent-dokument",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-dokumenter",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-egenansatt",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-egenansatt",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-gosys",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-gosys",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-inntekt",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-inntekt",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-institusjonsopphold",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-institusjonsopphold",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-medlemskap",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-medlemskap",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-norg",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-norg",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-oppgave-endret",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-personinfo",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-personinfo",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-representasjon",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-representasjon",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-skjermet-endret",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-sputnik",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-sputnik",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-stoppknapp",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-stoppknapp",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-tilbakedatert",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparkel-tilbakedatert",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sparsom",
                    "event_name": "aktivitetslogg_ny_aktivitet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "sparsom",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spedisjon-async",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "speed-async",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "speider",
                    "event_name": "application_down",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "speider",
                    "event_name": "application_stop",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "speider",
                    "event_name": "application_up",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "speider",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "speider",
                    "event_name": "pong",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spekemat-slakter",
                    "event_name": "behandling_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spekemat-slakter",
                    "event_name": "behandling_lukket",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spekemat-slakter",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spekemat-slakter",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn",
                    "event_name": "oppdrag_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn",
                    "event_name": "transaksjon_status",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn-avstemming",
                    "event_name": "hel_time",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spenn-avstemming",
                    "event_name": "oppdrag_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn-avstemming",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spenn-avstemming",
                    "event_name": "transaksjon_status",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spenn-mq",
                    "event_name": "oppdrag_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spenn-mq",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spenn-simulering",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spenn-simulering",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spennende",
                    "event_name": "minutt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "16"
                ]
            },
            {
                "metric": {
                    "app": "spennende",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "17"
                ]
            },
            {
                "metric": {
                    "app": "spennende",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "aktivitetslogg_ny_aktivitet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "124"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "avsluttet_med_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "58"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "avsluttet_uten_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "138"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "140"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "847"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "endret_skjermetinfo",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "gosys_oppgave_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "30"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "hent-dokument",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "48"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "klargjør_person_for_visning",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "28"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "kommandokjede_påminnelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "oppdater_persondata",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "50"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "person_avstemt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "32"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "70"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "sendt_søknad_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "138"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "sendt_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "82"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "140"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "sendt_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "80"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "stans_automatisk_behandling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "tilbakedatering_behandlet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "38"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "140"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "utbetaling_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "138"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "54"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "112"
                ]
            },
            {
                "metric": {
                    "app": "spesialist",
                    "event_name": "vedtaksperiode_ny_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "138"
                ]
            },
            {
                "metric": {
                    "app": "spesialist-sidegig",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spesialist-sidegig",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spesidaler-async",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spesidaler-async",
                    "event_name": "inntektsendringer",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spesidaler-async",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "aktivitetslogg_ny_aktivitet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "152"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "analytisk_datapakke",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "anmodning_om_forkasting",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "annullering",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "app_status",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "application_down",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "25"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "application_not_ready",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "59"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "application_ready",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "62"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "application_stop",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "25"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "application_up",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "25"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "39"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avbrutt_annet_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avbrutt_arbeidsledig_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avbrutt_frilanser_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avbrutt_jordbruker_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avbrutt_selvstendig_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avbrutt_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "33"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avsluttet_med_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avsluttet_uten_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "58"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "avstemming",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "behandling_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "behandling_lukket",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "60"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "152"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "behov_uten_fullstendig_løsning",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "benyttet_grunnlagsdata_for_beregning",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "66"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "dødsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "11"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "endret_skjermetinfo",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "gosys_oppgave_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "halv_time",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "hel_time",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "hent-dokument",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "36"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ident_opphørt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "inntektsendringer",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "inntektsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "41"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "inntektsmelding_før_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "32"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "inntektsmelding_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "45"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "inntektsmelding_ikke_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "inntektsmeldinger_replay",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "klargjør_person_for_visning",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "kommandokjede_avbrutt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "33"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "kommandokjede_ferdigstilt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "kommandokjede_påminnelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "kommandokjede_suspendert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "73"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "korrigerte_arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "kvarter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "lagt_på_vent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "midnatt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "minimum_sykdomsgrad_vurdert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "minutt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "44"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ny_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ny_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "29"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ny_søknad_frilans",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ny_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "22"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppdater_persondata",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "45"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppdrag_kvittering",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "48"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppdrag_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgave_oppdatert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "43"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgave_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "71"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgavestyring_ferdigbehandlet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgavestyring_kort_periode",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "56"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgavestyring_opprett",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "51"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgavestyring_opprett_speilrelatert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "22"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "oppgavestyring_utsatt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "overlappende_infotrygdperioder",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "49"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "overstyr_arbeidsforhold",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "overstyr_inntekt_og_refusjon",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "15"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "overstyr_tidslinje",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "12"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "overstyring_igangsatt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "140"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "person_avstemming",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "person_avstemt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "22"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "152"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "planlagt_annullering",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "pong",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "påminnelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "152"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "revurdering_ferdigstilt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "114"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "selvbestemte_arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "sendt_søknad_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "57"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "sendt_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "40"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "sendt_søknad_frilans",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "68"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "sendt_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "36"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "skatteinntekter_lagt_til_grunn",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "skjønnsmessig_fastsettelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "17"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "slackmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "stans_automatisk_behandling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "subsumsjon",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "73"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "søknad_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "tilbakedatering_behandlet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "9"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "transaksjon_status",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "trenger_ikke_opplysninger_fra_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "44"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "trenger_inntektsmelding_replay",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "trenger_opplysninger_fra_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "75"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "128"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "utbetaling_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "utbetaling_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "66"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "utbetaling_utbetalt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "utbetaling_uten_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "37"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "utkast_til_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "varsel_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "37"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_avvist",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "14"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "142"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_godkjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "52"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_ny_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "66"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "69"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperiode_påminnet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "152"
                ]
            },
            {
                "metric": {
                    "app": "spetakkel",
                    "event_name": "vedtaksperioder_venter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "76"
                ]
            },
            {
                "metric": {
                    "app": "spill-av-im",
                    "event_name": "inntektsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spill-av-im",
                    "event_name": "inntektsmelding_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spill-av-im",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spill-av-im",
                    "event_name": "trenger_inntektsmelding_replay",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spinnvill",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "spinnvill",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "anmodning_om_forkasting",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "annullering",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "29"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "avbrutt_arbeidsledig_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "avbrutt_frilanser_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "avbrutt_selvstendig_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "avbrutt_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "21"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "behov",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "376"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "dødsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "10"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "ident_opphørt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "infotrygdendring",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "45"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "inntektsendringer",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "inntektsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "38"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "inntektsmeldinger_replay",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "84"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "inntektsopplysninger_fra_lagret_inntektsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "korrigerte_arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "minimum_sykdomsgrad_vurdert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "minutt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "46"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "ny_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "79"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "ny_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "17"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "ny_søknad_frilans",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "ny_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "14"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "overstyr_arbeidsforhold",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "overstyr_inntekt_og_refusjon",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "10"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "overstyr_tidslinje",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "person_avstemming",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "30"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "134"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "påminnelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "134"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "selvbestemte_arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "sendt_søknad_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "57"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "sendt_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "27"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "sendt_søknad_frilans",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "75"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "sendt_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "22"
                ]
            },
            {
                "metric": {
                    "app": "spleis",
                    "event_name": "skjønnsmessig_fastsettelse",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "16"
                ]
            },
            {
                "metric": {
                    "app": "spock",
                    "event_name": "minutt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "38"
                ]
            },
            {
                "metric": {
                    "app": "spock",
                    "event_name": "person_avstemt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spock",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "28"
                ]
            },
            {
                "metric": {
                    "app": "spock",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "26"
                ]
            },
            {
                "metric": {
                    "app": "spock",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "22"
                ]
            },
            {
                "metric": {
                    "app": "spoiler",
                    "event_name": "overlappende_infotrygdperioder",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spoiler",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spoiler",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spoiler",
                    "event_name": "vedtaksperioder_venter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spokelse",
                    "event_name": "halv_time",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spokelse",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "26"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "inntektsmelding_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "oppgave_oppdatert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "oppgave_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "søknad_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "6"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "utbetaling_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "5"
                ]
            },
            {
                "metric": {
                    "app": "spoogle",
                    "event_name": "vedtaksperiode_ny_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "behandling_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "45"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "behandling_lukket",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "62"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "87"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "102"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "utbetaling_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "utbetaling_utbetalt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "12"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "utbetaling_uten_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "11"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "15"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "vedtaksperiode_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "sporbar",
                    "event_name": "vedtaksperioder_venter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "102"
                ]
            },
            {
                "metric": {
                    "app": "sporing",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "sporing",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sporing",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "sportsrevyen",
                    "event_name": "overstyring_igangsatt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "23"
                ]
            },
            {
                "metric": {
                    "app": "sportsrevyen",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "26"
                ]
            },
            {
                "metric": {
                    "app": "sportsrevyen",
                    "event_name": "ukjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "7"
                ]
            },
            {
                "metric": {
                    "app": "sportsrevyen",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "9"
                ]
            },
            {
                "metric": {
                    "app": "sportsrevyen",
                    "event_name": "vedtaksperiode_ny_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "17"
                ]
            },
            {
                "metric": {
                    "app": "spotlight",
                    "event_name": "halv_time",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spotlight",
                    "event_name": "kommandokjede_avbrutt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spotlight",
                    "event_name": "kommandokjede_ferdigstilt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spotlight",
                    "event_name": "kommandokjede_suspendert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spotlight",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spre-gosys",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "30"
                ]
            },
            {
                "metric": {
                    "app": "spre-gosys",
                    "event_name": "planlagt_annullering",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-gosys",
                    "event_name": "utbetaling_utbetalt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "30"
                ]
            },
            {
                "metric": {
                    "app": "spre-gosys",
                    "event_name": "utbetaling_uten_utbetaling",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "16"
                ]
            },
            {
                "metric": {
                    "app": "spre-gosys",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "30"
                ]
            },
            {
                "metric": {
                    "app": "spre-gosys",
                    "event_name": "vedtaksperiode_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "17"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "avsluttet_med_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "avsluttet_uten_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "inntektsmelding",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "20"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "inntektsmelding_før_søknad",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "8"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "inntektsmelding_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "20"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "inntektsmelding_ikke_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "korrigerte_arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "25"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "selvbestemte_arbeidsgiveropplysninger",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "3"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "sendt_søknad_arbeidsgiver",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "sendt_søknad_arbeidsledig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "13"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "sendt_søknad_frilans",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "sendt_søknad_nav",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "sendt_søknad_selvstendig",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "13"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "søknad_håndtert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "vedtaksperiode_endret",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "24"
                ]
            },
            {
                "metric": {
                    "app": "spre-oppgaver",
                    "event_name": "vedtaksperioder_venter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "25"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "avsluttet_uten_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "behandling_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "behandling_opprettet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "utkast_til_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "vedtaksperiode_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "vedtaksperiode_avvist",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "vedtaksperiode_godkjent",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-styringsinfo",
                    "event_name": "vedtaksperioder_venter",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-subsumsjon",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-subsumsjon",
                    "event_name": "subsumsjon",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "4"
                ]
            },
            {
                "metric": {
                    "app": "spre-subsumsjon",
                    "event_name": "vedtak_fattet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-subsumsjon",
                    "event_name": "vedtaksperiode_forkastet",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-sykmeldt",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spre-sykmeldt",
                    "event_name": "skatteinntekter_lagt_til_grunn",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "spregulering",
                    "event_name": "midnatt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "spregulering",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "94"
                ]
            },
            {
                "metric": {
                    "app": "spregulering",
                    "event_name": "utkast_til_vedtak",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "94"
                ]
            },
            {
                "metric": {
                    "app": "sprute",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "2"
                ]
            },
            {
                "metric": {
                    "app": "vedtaksfeed",
                    "event_name": "ping",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "vedtaksfeed",
                    "event_name": "utbetaling_annullert",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            },
            {
                "metric": {
                    "app": "vedtaksfeed",
                    "event_name": "utbetaling_utbetalt",
                    "namespace": "tbd"
                },
                "value": [
                    1770669637.611,
                    "1"
                ]
            }
        ],
    }
}