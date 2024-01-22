'use client'
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString, useQueryState } from 'next-usequerystate'
import { Alert, Button, Chips, Loader, Radio, RadioGroup, Select, TextField, UNSAFE_Combobox } from '@navikt/ds-react'
import { CogIcon } from '@navikt/aksel-icons'

import { NaisApp } from '@/types'
import { fetchJsonMedRequestId } from '@/utlis/fetch'
import { Graph } from '@/components/Graph'
import { ArkitekturNode, kalkulerNoder } from '@/nodes/kalkulerNoder'
import { Trie } from '@/trie/Trie'
import { namespaceToAkselColor, namespaceToColor } from '@/namespace/farger'
import { SideMeny } from '@/components/SideMeny'

export const Arkitektur = (): ReactElement => {
    const [env] = useQueryState('env', parseAsString.withDefault('prod'))
    const [sokemetode, setSokemetode] = useQueryState('sokemetode', parseAsString.withDefault('app'))
    const [brukFysikk, setBrukFysikk] = useState(false)
    const [visEmoji, setVisEmoji] = useQueryState('emoji', parseAsBoolean.withDefault(false))

    const [nivaaerUt, setNivaaerUt] = useQueryState('nivaaerUt', parseAsInteger.withDefault(1))
    const [nivaaerInn, setNivaaerInn] = useQueryState('nivaaerInn', parseAsInteger.withDefault(1))
    const [slettNoder, setSlettNoder] = useState(false)
    const [filter, setFilter] = useQueryState('filter', parseAsArrayOf(parseAsString).withDefault([]))
    const [filterTekst, setFilterTekst] = useState(filter.join(' '))
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const [slettedeNoder] = useQueryState('slettedeNoder', parseAsArrayOf(parseAsString).withDefault([]))
    const [appFilter, setAppFilter] = useState('')
    const initielleSlettedeNoder = useRef(slettedeNoder)

    const [hasTyped, setHasTyped] = useState(false)
    const namespaceCombobox = useRef<HTMLInputElement>(null)
    const [valgteNamespaces, setNamespaces] = useQueryState(
        'namespace',
        parseAsArrayOf(parseAsString).withDefault(['flex']),
    )
    const [valgteApper, setApper] = useQueryState(
        'apper',
        parseAsArrayOf(parseAsString).withDefault(['prod-gcp.flex.sykepengesoknad-backend']),
    )
    const [sideMenyOpen, setSideMenyOpen] = useState(false)
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

    useEffect(() => {
        const elements =
            namespaceCombobox.current?.parentElement?.parentElement?.getElementsByClassName('navds-chips__chip')
        if (elements) {
            Array.from(elements).forEach((element) => {
                element.setAttribute('style', `background-color: ${namespaceToColor(element.textContent || '')};`)
            })
        }
    }, [valgteNamespaces, data])

    const arkitekturNoder = useMemo(() => {
        if (!data) return [] as ArkitekturNode[]

        return kalkulerNoder(data)
    }, [data])

    const alleNamespaces = Array.from(new Set(data?.map((app) => app.namespace))).sort()

    const trie = useMemo(() => {
        const minTrie = new Trie()
        arkitekturNoder.forEach((app) => {
            if (app.nodeType === 'database') return
            minTrie.insert(app.navn, app)
            minTrie.insert(app.id, app)
        })

        return minTrie
    }, [arkitekturNoder])

    const filteredApper = useMemo(() => {
        if (appFilter.length < 3) {
            return []
        }

        const set = new Set(
            trie
                .findAllWithPrefix(appFilter)
                .map((app) => app.id)
                .filter((app) => !valgteApper.includes(app)),
        )
        return Array.from(set.values()).sort()
    }, [trie, appFilter, valgteApper])

    if (error) {
        return (
            <Alert className="m-10" variant="error">
                Kunne ikke hente data. Prøv igjen senere eller sjekk logger og nettleser console.
            </Alert>
        )
    }

    // unike namespaces fra data

    const onNamespaceSelected = (option: string, isSelected: boolean): void => {
        if (isSelected) {
            setNamespaces([...valgteNamespaces, option])
        } else {
            setNamespaces(valgteNamespaces.filter((o) => o !== option))
        }
    }

    return (
        <>
            <div className="h-46 px-10 py-5">
                <div className="flex gap-3">
                    <RadioGroup
                        legend="Søkemetode"
                        size="small"
                        value={sokemetode}
                        onChange={(val: string) => {
                            setSokemetode(val)
                        }}
                    >
                        <Radio value="app">App / Api / Topic</Radio>
                        <Radio value="namespace">Namespace</Radio>
                        <Radio value="alt">Vis alt</Radio>
                    </RadioGroup>
                    {sokemetode == 'namespace' && (
                        <UNSAFE_Combobox
                            ref={namespaceCombobox}
                            label="Namespace"
                            options={alleNamespaces}
                            isMultiSelect
                            selectedOptions={valgteNamespaces}
                            onToggleSelected={onNamespaceSelected}
                        />
                    )}
                    {sokemetode == 'app' && (
                        <UNSAFE_Combobox
                            label="App / Api / Topic"
                            className="w-96"
                            options={[...filteredApper]}
                            clearButton={true}
                            filteredOptions={filteredApper}
                            selectedOptions={[]}
                            onToggleSelected={(app) => {
                                if (app) {
                                    if (valgteApper.includes(app)) return
                                    setApper([...valgteApper, app])
                                }
                            }}
                            onChange={(e) => {
                                if (e?.target?.value) setAppFilter(e.target.value)
                            }}
                        />
                    )}

                    {sokemetode !== 'alt' && (
                        <>
                            <Select
                                label="Nivåer ut"
                                value={nivaaerUt + ''}
                                onChange={(e) => {
                                    setNivaaerUt(Number(e.target.value))
                                }}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">4</option>
                                <option value="6">5</option>
                            </Select>
                            <Select
                                label="Nivåer inn"
                                value={nivaaerInn + ''}
                                onChange={(e) => {
                                    setNivaaerInn(Number(e.target.value))
                                }}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">4</option>
                                <option value="6">5</option>
                            </Select>
                        </>
                    )}

                    {sokemetode == 'namespace' && (
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
                    )}

                    <div className="self-end">
                        <Button
                            variant="secondary-neutral"
                            onClick={() => setSideMenyOpen(!sideMenyOpen)}
                            icon={<CogIcon title="Innstillinger" />}
                        />
                    </div>
                </div>
                {sokemetode == 'alt' && (
                    <div className="mt-2">
                        <Alert variant="info">Viser alle noder, dette er litt tregt</Alert>
                    </div>
                )}
                {sokemetode == 'app' && (
                    <div className="mt-2">
                        <Chips>
                            {valgteApper.map((app) => {
                                const splitt = app.split('.')

                                function skapClassName(): string {
                                    if (splitt.length > 2) {
                                        return namespaceToAkselColor(splitt[1])
                                    }
                                    return namespaceToAkselColor(splitt[0])
                                }

                                return (
                                    <Chips.Removable
                                        key={app}
                                        onDelete={() => {
                                            setApper(valgteApper.filter((o) => o !== app))
                                        }}
                                        className={skapClassName()}
                                    >
                                        {app}
                                    </Chips.Removable>
                                )
                            })}
                        </Chips>
                    </div>
                )}
            </div>
            {isFetching && (
                <div className="flex justify-center items-center h-[60vh] w-100">
                    <div>
                        <Loader size="3xlarge" title="Venter..." />
                    </div>
                </div>
            )}
            {!isFetching && (
                <Graph
                    arkitekturNoder={arkitekturNoder}
                    sokemetode={sokemetode}
                    valgeApper={valgteApper}
                    valgteNamespaces={valgteNamespaces}
                    slettNoder={slettNoder}
                    filter={filter}
                    nivaaerUt={nivaaerUt}
                    nivaaerInn={nivaaerInn}
                    initielleSlettedeNoder={initielleSlettedeNoder.current}
                    brukFysikk={brukFysikk}
                    emoji={visEmoji}
                />
            )}
            <SideMeny
                slettNoder={slettNoder}
                setSlettNoder={setSlettNoder}
                openState={sideMenyOpen}
                setOpenState={setSideMenyOpen}
                setNamespaces={setNamespaces}
                setApper={setApper}
                brukFysikk={brukFysikk}
                setBrukFysikk={setBrukFysikk}
                visEmoji={visEmoji}
                setVisEmoji={setVisEmoji}
            ></SideMeny>
            {slettNoder && (
                <div className="fixed bottom-10 left-0 m-10 bg-gray-100 p-5 rounded">
                    <Alert variant="info">Klikk på noder og kanter du vil fjerne fra visualiseringen.</Alert>
                    <Button
                        className="mt-2"
                        variant="primary"
                        onClick={() => {
                            setSlettNoder(false)
                        }}
                    >
                        Ferdig
                    </Button>
                </div>
            )}
        </>
    )
}
