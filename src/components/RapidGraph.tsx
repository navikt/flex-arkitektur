import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Network, Options } from 'vis-network'
import { Chips } from '@navikt/ds-react'

import { namespaceToAkselColor, namespaceToColor } from '@/namespace/farger'
import { NoderOgKanter, RapidEdge } from '@/nodes/kalkulerRapidNoderOgKanter'

interface PopoverData {
    x: number
    y: number
    fromName: string
    toName: string
    events: string[]
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
    onEdgeClick?: (eventNames: string[]) => void
}): ReactElement {
    const container = useRef<HTMLDivElement>(null)
    const forrigeNoder = useRef(new Set<string>())
    const forrigeEdges = useRef(new Set<string>())
    const networkRef = useRef<Network>()
    const nettverkErRendret = useRef(false)
    const mousePosRef = useRef({ x: 0, y: 0 })

    const [popoverData, setPopoverData] = useState<PopoverData | null>(null)

    // Spor museposisjon globalt for popover-plassering
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            mousePosRef.current = { x: e.clientX, y: e.clientY }
        }
        document.addEventListener('mousemove', handleMouseMove)
        return () => document.removeEventListener('mousemove', handleMouseMove)
    }, [])

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
                interaction: {
                    hover: true,
                    tooltipDelay: 0,
                },
                edges: {
                    hoverWidth: 2,
                    selectionWidth: 2,
                    color: {
                        hover: '#0067C5',
                        highlight: '#0067C5',
                    },
                },
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

            // Hover handlers for popover og kant-fremheving
            networkRef.current.on('hoverEdge', (params: { edge: string }) => {
                const edge = data.edges.find((e) => e.id === params.edge) as RapidEdge | undefined
                if (edge) {
                    setPopoverData({
                        x: mousePosRef.current.x,
                        y: mousePosRef.current.y,
                        fromName: edge.fromNodeName || '',
                        toName: edge.toNodeName || '',
                        events: edge.events || [],
                    })
                }
            })

            networkRef.current.on('blurEdge', () => {
                setPopoverData(null)
            })

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
                        const edge = data.edges.find((e) => e.id === edgeId) as RapidEdge | undefined
                        if (edge?.events) {
                            onEdgeClick(edge.events)
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
            {popoverData && (
                <div
                    className="fixed z-[10000] bg-white border border-gray-300 rounded-lg shadow-lg p-3 pointer-events-none max-w-md"
                    style={{
                        left: popoverData.x + 15,
                        top: popoverData.y + 15,
                    }}
                >
                    <div className="text-sm">
                        <div className="mb-1">
                            <span className="text-gray-500 font-semibold">Fra: </span>
                            <span className="font-mono">{popoverData.fromName}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500 font-semibold">Til: </span>
                            <span className="font-mono">{popoverData.toName}</span>
                        </div>
                        <div className="text-gray-500 font-semibold mb-1">Events:</div>
                        <ul className="list-none space-y-0.5 pl-0">
                            {popoverData.events.map((event) => (
                                <li key={event} className="text-xs font-mono">
                                    {event}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
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
