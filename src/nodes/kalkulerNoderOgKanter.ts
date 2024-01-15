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
    visSynkrone: boolean,
    visEksterne: boolean,
    initielleSlettedeNoder: string[],
    nivaaerInn: number,
    nivaaerUt: number,
): NoderOgKanter {
    const noderBerortUt = new Map<string, ArkitekturNode>()

    filtreteApper.forEach((node) => noderBerortUt.set(node.id, node))

    function parseUtgaende(niva: number): void {
        const klon = new Map<string, ArkitekturNode>()
        noderBerortUt.forEach((node) => klon.set(node.id, node))

        if (niva > nivaaerUt) return
        klon.forEach((node) => {
            if (visSynkrone) {
                node.outgoingApp.forEach((out) => {
                    noderBerortUt.set(out.id, out)
                })
            }
            if (visEksterne) {
                node.outgoingHost.forEach((out) => {
                    noderBerortUt.set(out.id, out)
                })
            }
            if (visKafka) {
                node.readTopic.forEach((out) => {
                    noderBerortUt.set(out.id, out)
                })
                node.blirLestAvApp.forEach((inn) => {
                    noderBerortUt.set(inn.id, inn)
                })
            }
        })
        parseUtgaende(niva + 1)
    }

    const noderBerortInn = new Map<string, ArkitekturNode>()

    filtreteApper.forEach((node) => noderBerortInn.set(node.id, node))

    function parseInngaende(niva: number): void {
        const klon = new Map<string, ArkitekturNode>()
        noderBerortInn.forEach((node) => klon.set(node.id, node))

        if (niva > nivaaerInn) return
        klon.forEach((node) => {
            if (visSynkrone) {
                node.incomingApp.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
            }
            if (visEksterne) {
                node.blirKalltAvApp.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
            }
            if (visKafka) {
                node.writeTopic.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
                node.blirSkrevetTilAvApp.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
            }
        })
        parseInngaende(niva + 1)
    }

    parseUtgaende(1)
    parseInngaende(1)
    const data: NoderOgKanter = {
        nodes: [],
        edges: [],
    }
    const innOgUtNoder = new Map<string, ArkitekturNode>()
    noderBerortInn.forEach((node) => {
        innOgUtNoder.set(node.id, node)
    })
    noderBerortUt.forEach((node) => {
        innOgUtNoder.set(node.id, node)
    })

    innOgUtNoder.forEach((node) => {
        if (initielleSlettedeNoder.includes(node.id)) return
        if (node.nodeType == 'app') {
            data.nodes.push({
                id: node.id,
                label: `${namespaceToEmoji(node.namespace || '')} ${node.navn} \n\n  applikasjon`,
                shape: 'box',
                margin: {
                    top: 20,
                    bottom: 20,
                    left: 10,
                    right: 10,
                },
                group: node.namespace,
                font: {
                    face: 'monospace',
                    align: 'center',
                },
            })
        }
        if (node.nodeType == 'topic') {
            data.nodes.push({
                id: node.id,
                label: `${namespaceToEmoji(node.namespace || '')} ${node.navn} \n kafka topic`,
                shape: 'box',
                margin: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                },
                group: node.namespace,
                font: {
                    face: 'monospace',
                    align: 'center',
                },
            })
        }
        if (node.nodeType == 'ekstern') {
            data.nodes.push({
                id: node.id,
                label: `${namespaceToEmoji(node.namespace || '')} ${node.navn}`,
                shape: 'triangle',
                group: node.namespace,
                font: {
                    face: 'monospace',
                    align: 'left',
                },
            })
        }
        node.outgoingHost.forEach((out) => {
            const outNode = innOgUtNoder.get(out.id)
            if (outNode && visEksterne) {
                data.edges.push({
                    id: `${node.id}-${outNode.id}`,
                    from: node.id,
                    to: outNode.id,
                    arrows: { to: { enabled: true } },
                })
            }
        })
        node.outgoingApp.forEach((out) => {
            const outNode = innOgUtNoder.get(out.id)
            if (outNode && visSynkrone) {
                data.edges.push({
                    id: `${node.id}-${outNode.id}`,
                    from: node.id,
                    to: outNode.id,
                    arrows: { to: { enabled: true } },
                })
            }
        })
        if (node.nodeType == 'topic') {
            node.blirLestAvApp.forEach((out) => {
                const outNode = innOgUtNoder.get(out.id)
                if (outNode) {
                    const readwrite = node.blirSkrevetTilAvApp.has(out)
                    data.edges.push({
                        id: `${node.id}-${outNode.id}`,
                        dashes: true,
                        from: node.id,
                        to: outNode.id,
                        arrows: { to: { enabled: true }, from: { enabled: readwrite } },
                    })
                }
            })
            node.blirSkrevetTilAvApp.forEach((out) => {
                if (node.blirLestAvApp.has(out)) return
                const outNode = innOgUtNoder.get(out.id)
                if (outNode) {
                    data.edges.push({
                        id: `${node.id}-${outNode.id}`,
                        dashes: true,
                        from: node.id,
                        to: outNode.id,
                        arrows: { from: { enabled: true } },
                    })
                }
            })
        }
    })
    return data
}
