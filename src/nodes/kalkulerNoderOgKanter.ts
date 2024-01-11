import { Edge, Node } from 'vis-network'

import { ArkitekturNode } from '@/nodes/kalkulerNoder'
import { namespaceToEmoji } from '@/namespace/emojies'

interface NoderOgKanter {
    nodes: Node[]
    edges: Edge[]
}

export function kalkulerNoderOgKanter(
    filtreteApper: ArkitekturNode[],
    visKafka: boolean,
    initielleSlettedeNoder: string[],
): NoderOgKanter {
    const data: NoderOgKanter = {
        nodes: [],
        edges: [],
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
                function parseKafka(topic: ArkitekturNode, vei: 'read' | 'write' | 'readwrite'): void {
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
                        dashes: true,
                        arrows: {
                            to: { enabled: vei == 'read' || vei == 'readwrite' },
                            from: { enabled: vei == 'write' || vei == 'readwrite' },
                        },
                    })
                }

                app.writeTopic?.forEach((t) => {
                    if (app.readTopic.has(t)) {
                        parseKafka(t, 'readwrite')
                    } else {
                        parseKafka(t, 'write')
                    }
                })
                app.readTopic?.forEach((t) => {
                    if (app.writeTopic.has(t)) return
                    parseKafka(t, 'read')
                })
            })
    }

    filtreteApper.forEach((app) => {
        app.outgoingHost?.forEach((outHost) => {
            if (!data.nodes.find((node) => node.id === outHost.id)) {
                data.nodes.push({
                    id: outHost.id,
                    label: outHost.id,
                    shape: 'box',
                    group: 'extern',
                    font: {
                        face: 'monospace',
                        align: 'left',
                    },
                })
            }
            data.edges.push({ from: app.id, to: outHost.id, arrows: { to: { enabled: true } } })
        })
    })
    filtreteApper.forEach((app) => {
        app.outgoingApp?.forEach((outboundApp) => {
            data.edges.push({ from: app.id, to: outboundApp.id, arrows: { to: { enabled: true } } })
        })
    })
    return data
}
