import React, { ReactElement, useEffect, useRef } from 'react'
import { Network, Options } from 'vis-network'
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryState } from 'next-usequerystate'
import { Chips } from '@navikt/ds-react'

import { ArkitekturNode } from '@/nodes/kalkulerNoder'
import { filtrerArkitekturNoder } from '@/nodes/filtrerNoder'
import { kalkulerNoderOgKanter } from '@/nodes/kalkulerNoderOgKanter'
import { namespaceToAkselColor, namespaceToColor } from '@/namespace/farger'

export function Graph({
    arkitekturNoder,
    valgteNamespaces,
    slettNoder,
    filter,
    initielleSlettedeNoder,
    sokemetode,
    valgeApper,
    nivaaerUt,
    nivaaerInn,
}: {
    arkitekturNoder: ArkitekturNode[]
    valgteNamespaces: string[]
    slettNoder: boolean
    filter: string[]
    initielleSlettedeNoder: string[]
    sokemetode: string
    valgeApper: string[]
    nivaaerUt: number
    nivaaerInn: number
}): ReactElement {
    const container = useRef(null)
    const [, setSlettedeNoder] = useQueryState('slettedeNoder', parseAsArrayOf(parseAsString).withDefault([]))
    const forrigeNoder = useRef(new Set<string>())
    const forrigeEdges = useRef(new Set<string>())
    const networkRef = useRef<Network>()
    const [visSynkroneAppKall] = useQueryState('synkroneKall', parseAsBoolean.withDefault(true))
    const [visEksterneKall] = useQueryState('eksterneKall', parseAsBoolean.withDefault(true))
    const [visDatabase] = useQueryState('database', parseAsBoolean.withDefault(true))
    const [visKafka] = useQueryState('kafka', parseAsBoolean.withDefault(true))
    const [brukFysikk] = useQueryState('fysikk', parseAsBoolean.withDefault(true))
    const forrigeFysikk = useRef(brukFysikk)

    const filtrerteNoder = filtrerArkitekturNoder(
        arkitekturNoder,
        valgteNamespaces,
        valgeApper,
        initielleSlettedeNoder,
        filter,
        sokemetode,
    )
    const data = kalkulerNoderOgKanter({
        filtrerteNoder,
        visKafka,
        visSynkroneAppKall,
        visEksterneKall,
        initielleSlettedeNoder,
        visDatabase,
        nivaaerInn,
        nivaaerUt,
    })

    useEffect(() => {
        if (container.current) {
            const nyeNoder = new Set(data.nodes.map((node) => node.id as string))
            const nyeKanter = new Set(data.edges.map((edge) => edge.id as string))

            if (
                areSetsEqual(nyeNoder, forrigeNoder.current) &&
                areSetsEqual(nyeKanter, forrigeEdges.current) &&
                forrigeFysikk.current === brukFysikk
            ) {
                return
            }
            forrigeNoder.current = nyeNoder
            forrigeEdges.current = nyeKanter
            forrigeFysikk.current = brukFysikk
            const grupper = new Set<string>()
            data.nodes.forEach((node) => {
                if (node.group === undefined) return
                grupper.add(node.group)
            })
            const options: Options = {
                groups: {
                    noAuthConnection: {
                        color: { color: '#ff5a5a', highlight: '#ff5a5a', hover: '#ff5a5a' },
                    },
                },
                physics: {
                    enabled: brukFysikk,
                    barnesHut: {
                        gravitationalConstant: -40000,
                        centralGravity: 0.3,
                        springLength: 110,
                        springConstant: 0.04,
                        damping: 0.09,
                        avoidOverlap: 0,
                    },
                    maxVelocity: 30,
                    minVelocity: 3,
                    solver: 'barnesHut',
                    timestep: 0.5,
                    stabilization: {
                        enabled: true,
                        iterations: 100,
                        updateInterval: 50,
                    },
                },
            }
            Array.from(grupper).forEach((gruppe) => {
                options.groups[gruppe] = {
                    font: {
                        face: 'monospace',
                        align: 'left',
                        color: '#ffffff',
                    },
                    color: { background: namespaceToColor(gruppe), border: namespaceToColor(gruppe) },
                }
            })
            networkRef.current = new Network(container.current, data, options)
        }
    }, [data, brukFysikk])

    useEffect(() => {
        if (networkRef.current) {
            if (slettNoder) {
                networkRef.current.on('click', function (params) {
                    if (params.nodes.length > 0) {
                        try {
                            setSlettedeNoder((slettedeNoder) => [...slettedeNoder, params.nodes[0]])
                            networkRef.current?.selectNodes(params.nodes)
                            networkRef.current?.deleteSelected()
                            networkRef.current?.selectNodes([])
                        } catch (e) {
                            //TODO noe skjer, men det funker logger.error(e)
                        }
                    }
                    if (params.edges.length > 0) {
                        try {
                            networkRef.current?.selectEdges(params.edges)
                            networkRef.current?.deleteSelected()
                            networkRef.current?.selectEdges([])
                        } catch (e) {
                            //TODO noe skjer, men det funker logger.error(e)
                        }
                    }
                })
            } else {
                networkRef.current.off('click')
            }
        }
    }, [slettNoder, setSlettedeNoder])
    const grupper = new Set<string>()
    data.nodes.forEach((node) => {
        if (node.group === undefined) return
        grupper.add(node.group)
    })
    return (
        <>
            <div ref={container} style={{ height: 'calc(100vh - 20vh' }} />
            <div style={{ position: 'absolute', zIndex: 1000, bottom: '10px', left: '20px' }}>
                <Chips>
                    {Array.from(grupper).map((namespace) => {
                        return (
                            <Chips.Toggle
                                key={namespace}
                                className={namespaceToAkselColor(namespace) + ' text-white'}
                                checkmark={false}
                            >
                                {namespace}
                            </Chips.Toggle>
                        )
                    })}
                </Chips>
            </div>
        </>
    )
}

function areSetsEqual(setA: Set<string>, setB: Set<string>): boolean {
    if (setA.size !== setB.size) return false
    setA.forEach((a) => {
        if (!setB.has(a)) return false
    })

    return true
}
