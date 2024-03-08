const flexDatabaser = [
    {
        appName: 'ditt-sykefravaer-backend',
        namespace: 'flex',
        databases: ['ditt-sykefravaer-backend-db'],
    },
    {
        appName: 'flex-inntektsmelding-status',
        namespace: 'flex',
        databases: ['flex-inntektsmelding-status-db'],
    },
    {
        appName: 'flex-modia-kontakt-metrikk',
        namespace: 'flex',
        databases: ['flex-modia-kontakt-metrikk-db'],
    },
    {
        appName: 'flex-syketilfelle',
        namespace: 'flex',
        databases: ['flex-syketilfelle-db'],
    },
    {
        appName: 'flexjar-backend',
        namespace: 'flex',
        databases: ['flexjar-backend-db'],
    },
    {
        appName: 'spinnsyn-arkivering',
        namespace: 'flex',
        databases: ['spinnsyn-arkivering-db'],
    },
    {
        appName: 'spinnsyn-backend',
        namespace: 'flex',
        databases: ['spinnsyn-db'],
    },
    {
        appName: 'spinnsyn-brukernotifikasjon',
        namespace: 'flex',
        databases: ['spinnsyn-brukernotifikasjon-db'],
    },
    {
        appName: 'syfosoknadbrukernotifikasjon',
        namespace: 'flex',
        databases: ['syfosoknadbrukernotifikasjon-db'],
    },
    {
        appName: 'sykepengesoknad-altinn',
        namespace: 'flex',
        databases: ['sykepengesoknad-altinn-db'],
    },
    {
        appName: 'sykepengesoknad-arkivering-oppgave',
        namespace: 'flex',
        databases: ['sykepengesoknad-arkivering-oppgave-db'],
    },
    {
        appName: 'sykepengesoknad-backend',
        namespace: 'flex',
        databases: ['sykepengesoknad'],
    },
    {
        appName: 'sykepengesoknad-ikke-sendt-altinnvarsel',
        namespace: 'flex',
        databases: ['sykepengesoknad-ikke-sendt-altinnvarsel-db'],
    },
    {
        appName: 'sykepengesoknad-narmesteleder-varsler',
        namespace: 'flex',
        databases: ['sykepengesoknad-nl-varsel-db'],
    },
    {
        appName: 'sykepengesoknad-sak-status-metrikk',
        namespace: 'flex',
        databases: ['sykepengesoknad-sak-status-metrikk-db'],
    },
]

const teamsykmeldingDatabaser = [
    {
        appName: 'dinesykmeldte-backend',
        namespace: 'teamsykmelding',
        databases: ['dinesykmeldte-backend'],
    },
    {
        appName: 'helsesjekk-bot',
        namespace: 'teamsykmelding',
        databases: ['helsesjekk-bot'],
    },
    {
        appName: 'narmesteleder',
        namespace: 'teamsykmelding',
        databases: ['narmesteleder'],
    },
    {
        appName: 'narmesteleder-arbeidsforhold',
        namespace: 'teamsykmelding',
        databases: ['narmesteleder-arbeidsforhold'],
    },
    {
        appName: 'narmesteleder-varsel',
        namespace: 'teamsykmelding',
        databases: ['narmesteleder-varsel'],
    },
    {
        appName: 'pale-2',
        namespace: 'teamsykmelding',
        databases: ['pale-2'],
    },
    {
        appName: 'pale-2-register',
        namespace: 'teamsykmelding',
        databases: ['pale-2-register'],
    },
    {
        appName: 'smregistrering-backend',
        namespace: 'teamsykmelding',
        databases: ['smregistrering'],
    },
    {
        appName: 'sparenaproxy',
        namespace: 'teamsykmelding',
        databases: ['sparenaproxy'],
    },
    {
        appName: 'syfonlaltinn',
        namespace: 'teamsykmelding',
        databases: ['syfonlaltinn'],
    },
    {
        appName: 'syfosmaltinn',
        namespace: 'teamsykmelding',
        databases: ['syfosmaltinn'],
    },
    {
        appName: 'syfosmmanuell-backend',
        namespace: 'teamsykmelding',
        databases: ['syfosmmanuell-backend'],
    },
    {
        appName: 'syfosmmottak',
        namespace: 'teamsykmelding',
        databases: ['syfosmmottak'],
    },
    {
        appName: 'syfosmregister',
        namespace: 'teamsykmelding',
        databases: ['smregister'],
    },
    {
        appName: 'syfosmvarsel',
        namespace: 'teamsykmelding',
        databases: ['smvarsel'],
    },
    {
        appName: 'syk-dig-backend',
        namespace: 'teamsykmelding',
        databases: ['syk-dig-backend'],
    },
    {
        appName: 'sykmeldinger-arbeidsgiver',
        namespace: 'teamsykmelding',
        databases: ['sykmeldinger-arbeidsgiver'],
    },
    {
        appName: 'sykmeldinger-backend',
        namespace: 'teamsykmelding',
        databases: ['sykmeldinger'],
    },
]

export const databaser = [...flexDatabaser, ...teamsykmeldingDatabaser]
