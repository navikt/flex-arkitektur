'use client'
import React, { ReactElement, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BodyShort, Button, Heading, Loader, Table } from '@navikt/ds-react'
import { FilterIcon } from '@navikt/aksel-icons'

import { NaisApp } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'

type FilterKey = 'pdl' | 'aareg' | 'inntektskomp' | 'dokarkiv' | 'oppgave'

interface Filters {
    pdl: boolean
    aareg: boolean
    inntektskomp: boolean
    dokarkiv: boolean
    oppgave: boolean
}

// Filterkolonner som konfigurasjon med eksplisitt type
const filterColumns: Array<{ label: string; filterKey: FilterKey }> = [
    { label: 'PDL', filterKey: 'pdl' },
    { label: 'AAREG', filterKey: 'aareg' },
    { label: 'Inntektskomp', filterKey: 'inntektskomp' },
    { label: 'Oppgave', filterKey: 'oppgave' },
    { label: 'dokarkiv', filterKey: 'dokarkiv' },
]

export const PoHelse = (): ReactElement => {
    const { data, error, isFetching } = useQuery<NaisApp[], Error>({
        queryKey: [`nais-apper`, 'dev'],
        queryFn: async () => {
            const url = `/api/v1/naisapper?env=dev`

            return await fetchJsonMedRequestId(url)
        },
    })
    const [filters, setFilters] = useState<Filters>({
        pdl: false,
        aareg: false,
        inntektskomp: false,
        dokarkiv: false,
        oppgave: false,
    })
    if (isFetching) {
        return <Loader size="xlarge" className="m-16" />
    }
    if (error) {
        return <div>Feil ved henting av data</div>
    }
    if (!data) {
        return <div>Ingen data</div>
    }

    const tabellApper = prosseserApper(data)
    const toggleFilter = (key: FilterKey): void => {
        setFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    return (
        <>
            <Heading size="medium" level="1" className="m-16">
                PO Helse dev miljø
            </Heading>
            <Table className="m-16" size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>App</Table.HeaderCell>
                        {filterColumns.map(({ label, filterKey }) => (
                            <Table.HeaderCell key={filterKey}>
                                {label}
                                <Button
                                    className="mx-4"
                                    variant={filters[filterKey] ? 'secondary' : 'tertiary'}
                                    size="small"
                                    onClick={() => toggleFilter(filterKey)}
                                    icon={<FilterIcon title="filtrer" />}
                                />
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tabellApper
                        .filter(
                            (app) =>
                                app.pdl.length > 0 ||
                                app.aareg.length > 0 ||
                                app.inntektskomp.length > 0 ||
                                app.oppgave.length > 0 ||
                                app.dokarkiv.length > 0,
                        )
                        .filter((app) => (filters['pdl'] ? app.pdl.length > 0 : true))
                        .filter((app) => (filters['aareg'] ? app.aareg.length > 0 : true))
                        .filter((app) => (filters['inntektskomp'] ? app.inntektskomp.length > 0 : true))
                        .filter((app) => (filters['oppgave'] ? app.oppgave.length > 0 : true))
                        .filter((app) => (filters['dokarkiv'] ? app.dokarkiv.length > 0 : true))
                        .map((app, i) => {
                            return (
                                <Table.Row key={app.name + ' ' + i}>
                                    <Table.DataCell>{app.name}</Table.DataCell>
                                    <CelleForInnhold integrasjoner={app.pdl} />
                                    <CelleForInnhold integrasjoner={app.aareg} />
                                    <CelleForInnhold integrasjoner={app.inntektskomp} />
                                    <CelleForInnhold integrasjoner={app.oppgave} />
                                    <CelleForInnhold integrasjoner={app.dokarkiv} />
                                </Table.Row>
                            )
                        })}
                </Table.Body>
            </Table>
        </>
    )
}

function CelleForInnhold({ integrasjoner }: { integrasjoner: string[] }): ReactElement {
    function TagForUrl({ u }: { u: string }): ReactElement {
        const q2Tag = <div className="bg-blue-100 max-h-6 mr-2 px-2 border">q2</div>

        const q1Tag = <div className="bg-green-100 max-h-6 mr-2 px-2 border">q1</div>
        if (u.includes('q1')) {
            return q1Tag
        }
        if (u.includes('q2')) {
            return q2Tag
        }
        if (u == 'aareg-services.dev-fss-pub.nais.io') {
            return q2Tag
        }
        if (u == 'oppgave.dev-fss-pub.nais.io') {
            return q2Tag
        }
        if (u == 'dokarkiv.dev-fss-pub.nais.io') {
            return q1Tag
        }
        return <></>
    }

    return (
        <Table.DataCell>
            {integrasjoner.map((url, i) => {
                return (
                    <div className="flex" key={i}>
                        <TagForUrl u={url} />
                        <BodyShort>{url}</BodyShort>
                    </div>
                )
            })}
        </Table.DataCell>
    )
}

interface TabellApp {
    name: string
    pdl: string[]
    aareg: string[]
    inntektskomp: string[]
    oppgave: string[]
    dokarkiv: string[]
}

function prosseserApper(data: NaisApp[]): TabellApp[] {
    const namespaces = ['tsm', 'teamsykmelding', 'flex', 'speilvendt', 'tbd', 'risk', 'helsearbeidsgiver']

    const apper = data
        .filter((app) => {
            if (namespaces.includes(app.namespace)) {
                return true
            }
            return false
        })
        .filter((app) => {
            if (app.name.includes('demo')) {
                return false
            }
            return true
        })

    // sorter primært etter namespace og deretter etter navn
    apper.sort((a, b) => {
        // Finn indeksen til hver namespace i listen
        const indexA = namespaces.indexOf(a.namespace)
        const indexB = namespaces.indexOf(b.namespace)

        // Sammenlign rekkefølgen basert på indeksen
        if (indexA < indexB) return -1
        if (indexA > indexB) return 1

        // Hvis namespace er lik, sorter etter navn
        return a.name.localeCompare(b.name)
    })

    // lager en liste med apper og pdl og aareg

    const tabellApper: TabellApp[] = []

    apper.forEach((app) => {
        const hentDataFor = (identifier: string): string[] => {
            const hosts = app.outbound_hosts?.filter((host) => host.includes(identifier))
            const apps = app.outbound_apps?.filter((host) => host.includes(identifier))
            const kafka = app.read_topics?.filter((host) => host.includes(identifier))

            // Kombinerer array-ene, sjekker for null/undefined med nullish coalescing
            return hosts?.concat(apps ?? []).concat(kafka ?? []) || []
        }
        const pdlData = hentDataFor('pdl')
        const aaregData = hentDataFor('aareg')
        const inntektskomp = hentDataFor('team-inntekt')
        tabellApper.push({
            name: app.namespace + '.' + app.name,
            pdl: pdlData,
            aareg: aaregData,
            inntektskomp: inntektskomp,
            oppgave: hentDataFor('oppgave'),
            dokarkiv: hentDataFor('dokarkiv'),
        })
    })
    return tabellApper
}
