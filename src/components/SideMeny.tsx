import { Button, Modal, Select, Switch } from '@navikt/ds-react'
import React, { useState } from 'react'
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryState } from 'next-usequerystate'

interface SideMenyProps {
    openState: boolean
    setOpenState: (b: boolean) => void
    slettNoder: boolean
    setSlettNoder: (b: boolean) => void
    setNamespaces: (namespaces: string[]) => void
    setApper: (apper: string[]) => void
}

export function SideMeny({
    openState,
    setOpenState,
    slettNoder,
    setSlettNoder,
    setNamespaces,
    setApper,
}: SideMenyProps): React.JSX.Element {
    const [env, setEnv] = useQueryState('env', parseAsString.withDefault('prod'))

    const [visKafka, setVisKafka] = useQueryState('kafka', parseAsBoolean.withDefault(true))
    const [visSynkroneAppKall, setVisSynkroneAppKall] = useQueryState('synkroneKall', parseAsBoolean.withDefault(true))
    const [visEksterneKall, setVisEksterneKall] = useQueryState('eksterneKall', parseAsBoolean.withDefault(true))
    const [filter, setFilter] = useQueryState('filter', parseAsArrayOf(parseAsString).withDefault([]))
    const [, setFilterTekst] = useState(filter.join(' '))
    const [, setSlettedeNoder] = useQueryState('slettedeNoder', parseAsArrayOf(parseAsString).withDefault([]))
    return (
        <Modal
            open={openState}
            onClose={() => {
                setOpenState(false)
            }}
            header={{ heading: 'Innstillinger', closeButton: true }}
            className="h-screen max-h-max max-w-[369px] rounded-none p-0 left-auto m-0"
        >
            <Modal.Body>
                <div className="gap-y-8">
                    <div>
                        <Button
                            variant="secondary-neutral"
                            onClick={() => {
                                setFilter([])
                                setFilterTekst('')
                                setEnv('prod')
                                setNamespaces(['flex'])
                                setVisKafka(true)
                                setSlettNoder(false)
                                setSlettedeNoder([])
                                setApper([])
                                setOpenState(false)
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                    <div>
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
                    </div>
                    <Switch checked={visKafka} onChange={() => setVisKafka(!visKafka)}>
                        Kafka avhengigheter
                    </Switch>
                    <Switch checked={visSynkroneAppKall} onChange={() => setVisSynkroneAppKall(!visSynkroneAppKall)}>
                        Synkrone avhengigheter
                    </Switch>
                    <Switch checked={visEksterneKall} onChange={() => setVisEksterneKall(!visEksterneKall)}>
                        Eksterne synkrone avhengigheter
                    </Switch>
                    <Switch checked={slettNoder} onChange={() => setSlettNoder(!slettNoder)}>
                        Slett
                    </Switch>
                </div>
            </Modal.Body>
        </Modal>
    )
}
