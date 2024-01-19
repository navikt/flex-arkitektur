import { Edge, Node } from 'vis-network'

import { ArkitekturNode } from '@/nodes/kalkulerNoder'
import { namespaceToEmoji } from '@/namespace/emojies'

interface NoderOgKanter {
    nodes: Node[]
    edges: Edge[]
}

interface KalkulasjonOptions {
    filtrerteNoder: ArkitekturNode[]
    visKafka: boolean
    visSynkroneAppKall: boolean
    visEksterneKall: boolean
    visDatabase: boolean
    initielleSlettedeNoder: string[]
    nivaaerInn: number
    nivaaerUt: number
    emoji: boolean
    visIngresser: boolean
}

export function kalkulerNoderOgKanter({
    filtrerteNoder,
    visKafka,
    visSynkroneAppKall,
    visEksterneKall,
    visDatabase,
    initielleSlettedeNoder,
    nivaaerInn,
    nivaaerUt,
    emoji,
    visIngresser,
}: KalkulasjonOptions): NoderOgKanter {
    const noderBerortUt = new Map<string, ArkitekturNode>()

    filtrerteNoder.forEach((node) => noderBerortUt.set(node.id, node))

    function parseUtgaende(niva: number): void {
        const klon = new Map<string, ArkitekturNode>()
        noderBerortUt.forEach((node) => klon.set(node.id, node))

        if (niva > nivaaerUt) return
        klon.forEach((node) => {
            if (visSynkroneAppKall) {
                node.outgoingApp.forEach((out) => {
                    noderBerortUt.set(out.id, out)
                })
            }
            if (visEksterneKall) {
                node.outgoingHost.forEach((out) => {
                    noderBerortUt.set(out.id, out)
                })
            }
            if (visDatabase) {
                node.harDatabase.forEach((out) => {
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

    filtrerteNoder.forEach((node) => noderBerortInn.set(node.id, node))

    function parseInngaende(niva: number): void {
        const klon = new Map<string, ArkitekturNode>()
        noderBerortInn.forEach((node) => klon.set(node.id, node))

        if (niva > nivaaerInn) return
        klon.forEach((node) => {
            if (visSynkroneAppKall) {
                node.incomingApp.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
            }
            if (visEksterneKall) {
                node.blirKalltAvApp.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
            }
            if (visDatabase) {
                node.erDatabaseSomBlirBruktAv.forEach((inn) => {
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
            let label = `${namespaceToEmoji(emoji, node.namespace)} ${node.navn} \n\n  applikasjon`
            if (visIngresser) {
                label += '\n\n' + Array.from(node.ingresser).join('\n')
            }
            data.nodes.push({
                id: node.id,
                label: label,
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
                label: `${namespaceToEmoji(emoji, node.namespace)} ${node.navn} \n kafka topic`,
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
                label: `${namespaceToEmoji(emoji, node.namespace)}${node.navn}`,
                shape: 'triangle',
                group: node.namespace,
                font: {
                    face: 'monospace',
                    align: 'left',
                },
            })
        }
        if (node.nodeType == 'database') {
            data.nodes.push({
                id: node.id,
                label: `${node.navn}\ndatabase`,
                shape: 'hexagon',
                icon: { code: '\uf1c0' },
                group: node.namespace,
                font: {
                    face: 'monospace',
                    align: 'center',
                    color: 'black',
                },
            })
        }
        node.outgoingHost.forEach((out) => {
            const outNode = innOgUtNoder.get(out.id)
            if (outNode && visEksterneKall) {
                data.edges.push({
                    id: `${node.id}-${outNode.id}`,
                    from: node.id,
                    to: outNode.id,
                    arrows: { to: { enabled: true } },
                })
            }
        })
        node.harDatabase.forEach((out) => {
            const outNode = innOgUtNoder.get(out.id)
            if (outNode && visDatabase) {
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
            if (outNode && visSynkroneAppKall) {
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
