import { ReactElement, useEffect, useRef } from 'react'
import { Network, Node, Edge } from 'vis-network'

import { NaisApp } from '@/types'

export function Graph({
    apper,
    namespaces,
    visKafka,
}: {
    apper: NaisApp[]
    namespaces: string[]
    visKafka: boolean
}): ReactElement {
    const container = useRef(null)

    const filtreteApper = apper.filter((app) => namespaces.includes(app.namespace))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const data = {
        nodes: [] as Node[],
        edges: [] as Edge[],
    }

    filtreteApper
        .map((app) => {
            return {
                id: name(app),
                label: `${namespaceToEmoji(app.namespace)} ${app.name}`,
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
        filtreteApper.forEach((app) => {
            app.read_topics?.forEach((readTopic) => {
                if (!data.nodes.find((node) => node.id === readTopic)) {
                    const namespace = readTopic.split('.')[1]
                    const topicNavn = readTopic.split('.')[2]
                    data.nodes.push({
                        id: readTopic,
                        label: namespaceToEmoji(namespace) + ' ' + topicNavn,
                        shape: 'box',
                        group: namespace,
                        font: {
                            face: 'monospace',
                            align: 'left',
                        },
                    })
                }
            })
        })
    }

    filtreteApper.forEach((app) => {
        app.outbound_apps?.forEach((outboundApp) => {
            data.edges.push({ from: name(app), to: outboundApp, arrows: { to: { enabled: true } } })
        })
    })

    useEffect(() => {
        if (container.current) {
            const network = new Network(container.current, data, {
                groups: {
                    noAuthConnection: {
                        color: { color: '#ff5a5a', highlight: '#ff5a5a', hover: '#ff5a5a' },
                    },
                    teamsykmelding: {
                        font: {
                            face: 'monospace',
                            align: 'left',
                            color: '#ffffff',
                        },
                        color: { background: 'green' },
                    },
                    flex: {
                        font: {
                            face: 'monospace',
                            align: 'left',
                            color: '#ffffff',
                        },
                        color: { background: 'blue' },
                    },
                },
                physics: {
                    solver: 'forceAtlas2Based',
                },
            })
            network.on('click', function (params) {
                // eslint-disable-next-line
                console.log(params)
            })
        }
    }, [container, data])

    return <div ref={container} style={{ height: 'calc(100vh - var(--a-spacing-32))' }} />
}

function name(app: NaisApp): string {
    return `${app.cluster}.${app.namespace}.${app.name}`
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
    const emojies = [
        '👾',
        '🤖',
        '👽',
        '👻',
        '👺',
        '👹',
        '🤡',
        '👿',
        '👁',
        '👀',
        '🧠',
        '🦾',
        '🦿',
        '🦠',
        '🧬',
        '🧫',
        '🧪',
    ]
    const hash = namespace.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return emojies[hash % emojies.length]
}
