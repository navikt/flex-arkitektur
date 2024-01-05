'use client'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryState } from 'next-usequerystate'
import { Alert, Button, Select, Switch, TextField, UNSAFE_Combobox } from '@navikt/ds-react'

import { NaisApp } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'
import { Graph } from '@/components/Graph'

export const Arkitektur = (): ReactElement => {
    const [env, setEnv] = useQueryState('env', parseAsString.withDefault('prod'))
    const [visKafka, setVisKafka] = useQueryState('kafka', parseAsBoolean.withDefault(true))
    const [slettNoder, setSlettNoder] = useState(false)
    const [filter, setFilter] = useQueryState('filter', parseAsArrayOf(parseAsString).withDefault([]))
    const [filterTekst, setFilterTekst] = useState(filter.join(' '))
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const [slettedeNoder, setSlettedeNoder] = useQueryState(
        'slettedeNoder',
        parseAsArrayOf(parseAsString).withDefault([]),
    )

    const initielleSlettedeNoder = useRef(slettedeNoder)

    const [hasTyped, setHasTyped] = useState(false)

    const [namespaces, setNamespaces] = useQueryState('namespace', parseAsArrayOf(parseAsString).withDefault(['flex']))
    const { data, error, isFetching } = useQuery<NaisApp[], Error>({
        queryKey: [`nais-apper`, env],
        queryFn: async () => {
            const url = `/api/v1/naisapper?env=${env}`

            return await fetchJsonMedRequestId(url)
        },
    })
    useEffect(() => {
        // Avbryt eksisterende timeout
        if (timeoutId) clearTimeout(timeoutId)
        if (!hasTyped) return

        // Opprett en ny timeout
        const newTimeoutId = setTimeout(() => {
            setFilter(filterTekst.split(' '))
        }, 500)

        setTimeoutId(newTimeoutId)

        // Rengjøringsfunksjon
        return () => clearTimeout(newTimeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterTekst])

    if (!data || isFetching) {
        return <h2>Loading...</h2>
    }
    if (error) {
        return <Alert variant="error">Kunne ikke hente data fra api</Alert>
    }

    // unike namespaces fra data
    const alleNamespaces = Array.from(new Set(data.map((app) => app.namespace)))
    const onToggleSelected = (option: string, isSelected: boolean): void => {
        if (isSelected) {
            setNamespaces([...namespaces, option])
        } else {
            setNamespaces(namespaces.filter((o) => o !== option))
        }
    }
    return (
        <>
            <div className="h-32 p-10">
                <div className="flex gap-3">
                    <UNSAFE_Combobox
                        label="Namespace"
                        options={alleNamespaces}
                        isMultiSelect
                        selectedOptions={namespaces}
                        onToggleSelected={onToggleSelected}
                    />
                    <Select
                        label="Miljø"
                        value={env}
                        onChange={(e) => {
                            setEnv(e.target.value)
                        }}
                    >
                        <option value="prod">Produksjon</option>
                        <option value="dev">Utvikling</option>
                    </Select>
                    <TextField
                        label="Filter"
                        value={filterTekst}
                        onChange={(e) => {
                            setFilterTekst(e.target.value)
                            setHasTyped(true)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                setFilter(filterTekst.split(' '))
                            }
                        }}
                    />
                    <div className="self-end">
                        <Switch checked={visKafka} onChange={() => setVisKafka(!visKafka)}>
                            Vis Kafka
                        </Switch>
                    </div>
                    <div className="self-end">
                        <Switch checked={slettNoder} onChange={() => setSlettNoder(!slettNoder)}>
                            Slett noder med museklikk
                        </Switch>
                    </div>
                    <div className="self-end">
                        <Button
                            variant="secondary-neutral"
                            onClick={() => {
                                setFilter([])
                                setFilterTekst('')
                                setNamespaces(['flex'])
                                setVisKafka(true)
                                setSlettNoder(false)
                                setSlettedeNoder([])
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
            <Graph
                apper={data}
                namespaces={namespaces}
                visKafka={visKafka}
                slettNoder={slettNoder}
                filter={filter}
                initielleSlettedeNoder={initielleSlettedeNoder.current}
            />
        </>
    )
}
