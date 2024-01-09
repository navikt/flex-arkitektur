import React, { ReactElement, useEffect, useRef } from 'react'
import { Network, Node, Edge, Options } from 'vis-network'
import { logger } from '@navikt/next-logger'
import { parseAsArrayOf, parseAsString, useQueryState } from 'next-usequerystate'
import { Chips } from '@navikt/ds-react'

import { namespaceToAkselColor, namespaceToColor } from '@/components/farger'
import { ArkitekturNode } from '@/nodes/kalkulerNoder'

export function Graph({
    arkitekturNoder,
    namespaces,
    visKafka,
    slettNoder,
    filter,
    initielleSlettedeNoder,
}: {
    arkitekturNoder: ArkitekturNode[]
    namespaces: string[]
    visKafka: boolean
    slettNoder: boolean
    filter: string[]
    initielleSlettedeNoder: string[]
}): ReactElement {
    const container = useRef(null)
    const [, setSlettedeNoder] = useQueryState('slettedeNoder', parseAsArrayOf(parseAsString).withDefault([]))
    const forrigeNoder = useRef(new Set<string>())
    const forrigeEdges = useRef(new Set<string>())
    const networkRef = useRef<Network>()
    const filtreteApper = arkitekturNoder
        .filter((app) => {
            if (app.namespace === undefined) return false
            return namespaces.includes(app.namespace)
        })
        .filter((app) => {
            return !initielleSlettedeNoder.includes(app.id)
        })
        .filter((app) => {
            if (filter.length === 0) {
                return true
            }
            return filter.some((f) => {
                return app.id.includes(f)
            })
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = {
        nodes: [] as Node[],
        edges: [] as Edge[],
    }
    filtreteApper
        .map((app) => {
            return {
                id: app.id,
                label: `${namespaceToEmoji(app.namespace || '')} ${app.navn}`,
                shape: 'box',
                group: app.namespace,
                font: {
                    face: 'monospace',
                    align: 'left',
                },
            }
        })
        .forEach((node) => data.nodes?.push(node))

    if (visKafka) {
        filtreteApper
            .filter((ap) => {
                return ap.nodeType == 'app'
            })
            .forEach((app) => {
                function parseKafka(topic: ArkitekturNode, write: boolean): void {
                    if (initielleSlettedeNoder.includes(topic.id)) return
                    if (!data.nodes.find((node) => node.id === topic.id)) {
                        data.nodes.push({
                            id: topic.id,
                            label: namespaceToEmoji(topic.namespace || '') + ' ' + topic.navn,
                            shape: 'box',
                            group: topic.namespace,
                            font: {
                                face: 'monospace',
                                align: 'left',
                            },
                        })
                    }
                    data.edges.push({
                        from: topic.id,
                        to: app.id,
                        arrows: { to: { enabled: !write }, from: { enabled: write } },
                    })
                }

                app.writeTopic?.forEach((t) => {
                    parseKafka(t, true)
                })
                app.readTopic?.forEach((t) => {
                    parseKafka(t, false)
                })
            })
    }

    filtreteApper.forEach((app) => {
        app.outgoingApp?.forEach((outboundApp) => {
            data.edges.push({ from: app.id, to: outboundApp.id, arrows: { to: { enabled: true } } })
        })
    })

    useEffect(() => {
        if (container.current) {
            const nyeNoder = new Set(data.nodes.map((node) => node.id as string))
            const nyeKanter = new Set(data.edges.map((edge) => edge.id as string))

            if (areSetsEqual(nyeNoder, forrigeNoder.current) && areSetsEqual(nyeKanter, forrigeEdges.current)) {
                return
            }
            logger.info('Rerendrer graf')
            forrigeNoder.current = nyeNoder
            forrigeEdges.current = nyeKanter
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
                    solver: 'forceAtlas2Based',
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
    }, [data])

    useEffect(() => {
        if (networkRef.current) {
            if (slettNoder) {
                networkRef.current.on('click', function (params) {
                    if (params.nodes.length == 0) return
                    try {
                        setSlettedeNoder((slettedeNoder) => [...slettedeNoder, params.nodes[0]])
                        networkRef.current?.selectNodes(params.nodes)
                        networkRef.current?.deleteSelected()
                        networkRef.current?.selectNodes([])
                    } catch (e) {
                        //TODO noe skjer, men det funker logger.error(e)
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
            <div ref={container} style={{ height: 'calc(100vh - var(--a-spacing-32))' }} />
            <div style={{ position: 'absolute', zIndex: 1000, bottom: '10px', right: '20px' }}>
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

function namespaceToEmoji(namespace: string): string {
    switch (namespace) {
        case 'teamsykmelding':
            return '💉'
        case 'flex':
            return '💪'
        case 'team-esyfo':
            return '🫂'
        case 'risk':
            return '☣️'
        case 'teamsykefravr':
            return '🏥'
        case 'helsearbeidsgiver':
            return '🧑‍💼'
        case 'personbruker':
            return '🧑🏽'
        default:
            return randomEmojiFromHash(namespace)
    }
}

function randomEmojiFromHash(namespace: string): string {
    const emojies = ['👾', '🤖', '👽', '👻', '👹', '🤡', '👁', '👀', '🧠', '🦾', '🦿', '🧬', '🧫', '🧪']
    const hash = namespace.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return emojies[hash % emojies.length]
}

function areSetsEqual(setA: Set<string>, setB: Set<string>): boolean {
    if (setA.size !== setB.size) return false
    setA.forEach((a) => {
        if (!setB.has(a)) return false
    })

    return true
}
