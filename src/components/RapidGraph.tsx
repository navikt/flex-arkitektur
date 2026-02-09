import React, { ReactElement, useEffect, useRef } from 'react'
import { Edge, Network, Node, Options } from 'vis-network'
import { Chips } from '@navikt/ds-react'

import { namespaceToAkselColor, namespaceToColor } from '@/namespace/farger'

interface NoderOgKanter {
    nodes: Node[]
    edges: Edge[]
}

export function RapidGraph({
    data,
    fullscreen,
    brukFysikk,
    ekskluderModus,
    onEdgeClick,
}: {
    data: NoderOgKanter
    fullscreen: boolean
    brukFysikk: boolean
    ekskluderModus: boolean
    onEdgeClick?: (eventName: string) => void
}): ReactElement {
    const container = useRef(null)
    const forrigeNoder = useRef(new Set<string>())
    const forrigeEdges = useRef(new Set<string>())
    const networkRef = useRef<Network>()
    const nettverkErRendret = useRef(false)

    useEffect(() => {
        if (nettverkErRendret.current) {
            if (networkRef.current) {
                networkRef.current?.setOptions({ physics: { enabled: brukFysikk } })
            }
        }
    }, [brukFysikk])

    useEffect(() => {
        if (container.current) {
            const nyeNoder = new Set(data.nodes.map((node) => node.id as string))
            const nyeKanter = new Set(data.edges.map((edge) => edge.id as string))

            if (areSetsEqual(nyeNoder, forrigeNoder.current) && areSetsEqual(nyeKanter, forrigeEdges.current)) {
                return
            }
            forrigeNoder.current = nyeNoder
            forrigeEdges.current = nyeKanter

            const grupper = new Set<string>()
            data.nodes.forEach((node) => {
                if (node.group === undefined) return
                grupper.add(node.group)
            })

            const options: Options = {
                groups: {},
                physics: {
                    enabled: true,
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
                options.groups![gruppe] = {
                    font: {
                        face: 'monospace',
                        align: 'left',
                        color: '#ffffff',
                    },
                    color: { background: namespaceToColor(gruppe), border: namespaceToColor(gruppe) },
                }
            })

            networkRef.current = new Network(container.current, data, options)

            setTimeout(() => {
                if (!brukFysikk) {
                    networkRef.current?.setOptions({ physics: { enabled: brukFysikk } })
                }
                nettverkErRendret.current = true
            }, 20)
        }
    }, [data, brukFysikk])

    // Håndter klikk på kanter for å ekskludere events
    // VIKTIG: Denne effekten må komme ETTER network creation effekten,
    // fordi React kjører effects i deklarasjonsrekkefølge.
    // Når data endres recreates nettverket først, så attaches click handler til det nye nettverket.
    useEffect(() => {
        if (networkRef.current) {
            if (ekskluderModus && onEdgeClick) {
                networkRef.current.on('click', function (params) {
                    if (params.edges.length > 0 && params.nodes.length === 0) {
                        const edgeId = params.edges[0] as string
                        const edge = data.edges.find((e) => e.id === edgeId)
                        if (edge?.label) {
                            onEdgeClick(edge.label as string)
                        }
                    }
                })
            } else {
                networkRef.current.off('click')
            }
        }
    }, [ekskluderModus, onEdgeClick, data])

    const grupper = new Set<string>()
    data.nodes.forEach((node) => {
        if (node.group === undefined) return
        grupper.add(node.group)
    })
    const gruppeliste = Array.from(grupper)

    function height(): string {
        if (fullscreen) {
            return '100vh'
        }
        return 'calc(100vh - 28vh)'
    }

    return (
        <>
            <div ref={container} style={{ height: height() }} />
            {gruppeliste.length < 20 && (
                <div style={{ position: 'absolute', zIndex: 1000, bottom: '10px', left: '20px' }}>
                    <Chips>
                        {gruppeliste.map((namespace) => {
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
            )}
        </>
    )
}

function areSetsEqual(setA: Set<string>, setB: Set<string>): boolean {
    if (setA.size !== setB.size) return false
    for (const a of setA) {
        if (!setB.has(a)) return false
    }
    return true
}
