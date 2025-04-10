'use client'
import React, { ReactElement, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Heading, Loader, Table } from '@navikt/ds-react'
import { FilterIcon } from '@navikt/aksel-icons'

import { NaisApp } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'

export const PoHelse = (): ReactElement => {
    const { data, error, isFetching } = useQuery<NaisApp[], Error>({
        queryKey: [`nais-apper`, 'dev'],
        queryFn: async () => {
            const url = `/api/v1/naisapper?env=dev`

            return await fetchJsonMedRequestId(url)
        },
    })
    const [filterPdl, setFilterPdl] = useState(false)
    const [filterAareg, setFilterAareg] = useState(false)
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

    return (
        <>
            <Heading size="medium" level="1" className="m-16">
                PO Helse dev miljø
            </Heading>
            <Table className="m-16" size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>App</Table.HeaderCell>
                        <Table.HeaderCell>
                            PDL
                            <Button
                                className="mx-4"
                                variant={filterPdl ? 'secondary' : 'tertiary'}
                                size="small"
                                onClick={() => {
                                    setFilterPdl(!filterPdl)
                                }}
                                icon={<FilterIcon title="filtrer" />}
                            />
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            AAREG
                            <Button
                                className="mx-4"
                                variant={filterAareg ? 'secondary' : 'tertiary'}
                                size="small"
                                onClick={() => {
                                    setFilterAareg(!filterAareg)
                                }}
                                icon={<FilterIcon title="filtrer" />}
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tabellApper
                        .filter((app) => (filterPdl ? app.pdl.length > 0 : true))
                        .filter((app) => (filterAareg ? app.aareg.length > 0 : true))
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
}

function prosseserApper(data: NaisApp[]): TabellApp[] {
    const namespaces = ['tsm', 'teamsykmelding', 'flex', 'tbd', 'helsearbeidsgiver']

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
        const pdl = app.outbound_hosts?.filter((host) => host.includes('pdl'))
        const pdlApp = app.outbound_apps?.filter((host) => host.includes('pdl'))
        const pdlKafka = app.read_topics?.filter((host) => host.includes('pdl'))

        const pdlAlt = pdl?.concat(pdlApp ?? []).concat(pdlKafka ?? []) || []

        const aareg = app.outbound_hosts?.filter((host) => host.includes('aareg'))
        const aaregApp = app.outbound_apps?.filter((host) => host.includes('aareg'))
        const aaregKafka = app.read_topics?.filter((host) => host.includes('aareg'))

        const aaregAlt = aareg?.concat(aaregApp ?? []).concat(aaregKafka ?? []) || []

        tabellApper.push({ name: app.namespace + '.' + app.name, pdl: pdlAlt, aareg: aaregAlt })
    })
    return tabellApper
}
