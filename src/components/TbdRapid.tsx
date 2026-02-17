'use client'
import React, { ReactElement, useMemo, useState } from 'react'
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { Alert, Button, Chips, Loader, Radio, RadioGroup, Switch, UNSAFE_Combobox } from '@navikt/ds-react'
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons'

import { useTbdRapidData } from '@/hooks/useTbdRapidData'
import { kalkulerRapidNoder, RapidNode } from '@/nodes/kalkulerRapidNoder'
import { filtrerRapidNoder } from '@/nodes/filtrerRapidNoder'
import { kalkulerRapidNoderOgKanter } from '@/nodes/kalkulerRapidNoderOgKanter'
import { RapidGraph } from '@/components/RapidGraph'
import { namespaceToAkselColor } from '@/namespace/farger'

export const TbdRapid = (): ReactElement => {
    const [sokemetode, setSokemetode] = useQueryState('sokemetode', parseAsString.withDefault('app'))
    const [brukFysikk] = useState(false)
    const [fullscreen, setFullscreen] = useQueryState('fullscreen', parseAsBoolean.withDefault(false))
    const [valgteApper, setApper] = useQueryState('apper', parseAsArrayOf(parseAsString).withDefault([]))
    const [valgteEvents, setEvents] = useQueryState('events', parseAsArrayOf(parseAsString).withDefault([]))
    const [inkluderNaboer, setInkluderNaboer] = useQueryState('naboer', parseAsBoolean.withDefault(true))
    const [appFilter, setAppFilter] = useState('')
    const [eventFilter, setEventFilter] = useState('')

    const { data, error, isFetching } = useTbdRapidData()

    const rapidNoder = useMemo(() => {
        if (!data) return [] as RapidNode[]
        return kalkulerRapidNoder(data)
    }, [data])

    // Hent unike app-navn fra kalkulerte noder (ikke rådata)
    const alleApper = useMemo(() => {
        if (!rapidNoder || rapidNoder.length === 0) return []
        const appSet = new Set<string>()
        rapidNoder.forEach((node) => {
            appSet.add(node.id)
        })
        return Array.from(appSet).sort()
    }, [rapidNoder])

    // Hent unike event-navn fra beregnede noder (kun events med faktiske relasjoner)
    const alleEvents = useMemo(() => {
        const eventSet = new Set<string>()
        rapidNoder.forEach((node) => {
            // Events som produseres
            node.produceEvents.forEach((_, eventName) => {
                if (eventName !== 'ping') eventSet.add(eventName)
            })
            // Events som konsumeres
            node.consumeEvents.forEach((_, eventName) => {
                if (eventName !== 'ping') eventSet.add(eventName)
            })
            // Behov som sendes
            node.sendBehov.forEach((_, losning) => {
                eventSet.add(`behov-${losning}`)
            })
        })
        return Array.from(eventSet).sort()
    }, [rapidNoder])

    // Filtrer app-liste basert på søketekst
    const filtrerteApperForCombobox = useMemo(() => {
        if (appFilter.length < 2) return alleApper
        return alleApper.filter(
            (app) => app.toLowerCase().includes(appFilter.toLowerCase()) && !valgteApper.includes(app),
        )
    }, [alleApper, appFilter, valgteApper])

    // Filtrer event-liste basert på søketekst
    const filtrerteEventsForCombobox = useMemo(() => {
        if (eventFilter.length < 2) return alleEvents
        return alleEvents.filter(
            (event) => event.toLowerCase().includes(eventFilter.toLowerCase()) && !valgteEvents.includes(event),
        )
    }, [alleEvents, eventFilter, valgteEvents])

    // Kalkuler filtrerte noder og kanter for grafen
    const noderOgKanter = useMemo(() => {
        const filtrerte = filtrerRapidNoder(rapidNoder, sokemetode, valgteApper, valgteEvents, inkluderNaboer)
        return kalkulerRapidNoderOgKanter({
            filtrerteNoder: filtrerte,
            sokemetode,
            valgteEvents,
            maxChars: 50,
        })
    }, [rapidNoder, sokemetode, valgteApper, valgteEvents, inkluderNaboer])

    if (error) {
        return (
            <Alert className="m-10" variant="error">
                Kunne ikke hente data. Prøv igjen senere eller sjekk logger og nettleser console.
            </Alert>
        )
    }

    return (
        <>
            {fullscreen && (
                <Button
                    variant="secondary-neutral"
                    className="mr-2 fixed top-10 right-10 z-50"
                    onClick={() => setFullscreen(false)}
                    icon={<ShrinkIcon title="Fullscreen" />}
                />
            )}
            {!fullscreen && (
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
                            <Radio value="app">App</Radio>
                            <Radio value="event">Event</Radio>
                        </RadioGroup>
                        {sokemetode === 'app' && (
                            <UNSAFE_Combobox
                                label="App"
                                className="w-96"
                                options={filtrerteApperForCombobox}
                                clearButton={true}
                                filteredOptions={filtrerteApperForCombobox}
                                selectedOptions={[]}
                                onToggleSelected={(app) => {
                                    if (app) {
                                        if (valgteApper.includes(app)) return
                                        setApper([...valgteApper, app])
                                    }
                                }}
                                onChange={(value) => {
                                    if (value) setAppFilter(value)
                                }}
                            />
                        )}
                        {sokemetode === 'event' && (
                            <UNSAFE_Combobox
                                label="Event"
                                className="w-96"
                                options={filtrerteEventsForCombobox}
                                clearButton={true}
                                filteredOptions={filtrerteEventsForCombobox}
                                selectedOptions={[]}
                                onToggleSelected={(event) => {
                                    if (event) {
                                        if (valgteEvents.includes(event)) return
                                        setEvents([...valgteEvents, event])
                                    }
                                }}
                                onChange={(value) => {
                                    if (value) setEventFilter(value)
                                }}
                            />
                        )}
                        <div className="self-end flex items-center gap-2">
                            {sokemetode === 'app' && valgteApper.length > 0 && (
                                <Switch
                                    size="small"
                                    checked={inkluderNaboer}
                                    onChange={(e) => setInkluderNaboer(e.target.checked)}
                                >
                                    Inkluder naboer
                                </Switch>
                            )}
                            <Button
                                variant="secondary-neutral"
                                className="mr-2"
                                onClick={() => setFullscreen(true)}
                                icon={<ExpandIcon title="Fullscreen" />}
                            />
                        </div>
                    </div>
                    {sokemetode === 'app' && valgteApper.length > 0 && (
                        <div className="mt-2">
                            <Chips>
                                {valgteApper.map((app) => {
                                    const splitt = app.split('.')
                                    const namespace = splitt[0]

                                    return (
                                        <Chips.Removable
                                            key={app}
                                            onDelete={() => {
                                                setApper(valgteApper.filter((o) => o !== app))
                                            }}
                                            className={namespaceToAkselColor(namespace)}
                                        >
                                            {app}
                                        </Chips.Removable>
                                    )
                                })}
                            </Chips>
                        </div>
                    )}
                    {sokemetode === 'event' && valgteEvents.length > 0 && (
                        <div className="mt-2">
                            <Chips>
                                {valgteEvents.map((event) => {
                                    return (
                                        <Chips.Removable
                                            key={event}
                                            onDelete={() => {
                                                setEvents(valgteEvents.filter((o) => o !== event))
                                            }}
                                        >
                                            {event}
                                        </Chips.Removable>
                                    )
                                })}
                            </Chips>
                        </div>
                    )}
                </div>
            )}
            {isFetching && (
                <div className="flex justify-center items-center h-[60vh] w-100">
                    <div>
                        <Loader size="3xlarge" title="Venter..." />
                    </div>
                </div>
            )}
            {!isFetching && <RapidGraph data={noderOgKanter} fullscreen={fullscreen} brukFysikk={brukFysikk} />}
        </>
    )
}
