'use client'
import React, { ReactElement, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Heading, Loader, Table } from '@navikt/ds-react'
import { FilterIcon } from '@navikt/aksel-icons'

import { NaisApp } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'

type FilterKey = 'pdl' | 'aareg' | 'inntektskomp'

interface Filters {
    pdl: boolean
    aareg: boolean
    inntektskomp: boolean
}

// Filterkolonner som konfigurasjon med eksplisitt type
const filterColumns: Array<{ label: string; filterKey: FilterKey }> = [
    { label: 'PDL', filterKey: 'pdl' },
    { label: 'AAREG', filterKey: 'aareg' },
    { label: 'Inntektskomp', filterKey: 'inntektskomp' },
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
                        .filter((app) => app.pdl.length > 0 || app.aareg.length > 0 || app.inntektskomp.length > 0)
                        .filter((app) => (filters['pdl'] ? app.pdl.length > 0 : true))
                        .filter((app) => (filters['aareg'] ? app.aareg.length > 0 : true))
                        .filter((app) => (filters['inntektskomp'] ? app.inntektskomp.length > 0 : true))
                        .map((app, i) => {
                            return (
                                <Table.Row key={app.name + ' ' + i}>
                                    <Table.DataCell>{app.name}</Table.DataCell>
                                    <Table.DataCell>
                                        {app.pdl.map((pdl, i) => {
                                            return <div key={i}>{pdl}</div>
                                        })}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {app.aareg.map((pdl, i) => {
                                            return <div key={i}>{pdl}</div>
                                        })}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {app.inntektskomp.map((pdl, i) => {
                                            return <div key={i}>{pdl}</div>
                                        })}
                                    </Table.DataCell>
                                </Table.Row>
                            )
                        })}
                </Table.Body>
            </Table>
        </>
    )
}

interface TabellApp {
    name: string
    pdl: string[]
    aareg: string[]
    inntektskomp: string[]
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
        })
    })
    return tabellApper
}
