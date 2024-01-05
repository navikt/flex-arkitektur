import { ReactElement, useEffect, useRef } from 'react'
import { Network } from 'vis-network'

import { NaisApp } from '@/types'

export function Graph({ apper, namespaces }: { apper: NaisApp[]; namespaces: string[] }): ReactElement {
    const container = useRef(null)

    const filtreteApper = apper.filter((app) => namespaces.includes(app.namespace))

    const nodes = filtreteApper.map((app) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const edges = [] as { from: string; to: string }[] //TODO memo

    filtreteApper.forEach((app) => {
        app.outbound_apps?.forEach((outboundApp) => {
            edges.push({ from: name(app), to: outboundApp })
        })
    })

    useEffect(() => {
        container.current &&
            new Network(
                container.current,
                { nodes, edges },
                {
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
                            color: { background: 'green', border: 'darkgreen' },
                        },
                        flex: {
                            font: {
                                face: 'monospace',
                                align: 'left',
                                color: '#ffffff',
                            },
                            color: { background: 'red', border: 'darkgreen' },
                        },
                    },
                    physics: {
                        solver: 'forceAtlas2Based',
                    },
                },
            )
    }, [container, nodes, edges])

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
        case 'personbruker':
            return '🧑🏽'
        default:
            return ''
    }
}
