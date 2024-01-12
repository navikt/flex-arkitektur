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
        //klone noderberort map
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
                node.writeTopic.forEach((out) => {
                    noderBerortUt.set(out.id, out)
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
            if (visKafka) {
                node.readTopic.forEach((inn) => {
                    noderBerortInn.set(inn.id, inn)
                })
            }
            // TODO incoming for ekstern host bør funke?
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

        data.nodes.push({
            id: node.id,
            label: `${namespaceToEmoji(node.namespace || '')} ${node.navn}`,
            shape: 'box',
            group: node.namespace,
            font: {
                face: 'monospace',
                align: 'left',
            },
        })
        node.outgoingHost.forEach((out) => {
            const outNode = innOgUtNoder.get(out.id)
            if (outNode) {
                data.edges.push({ from: node.id, to: outNode.id, arrows: { to: { enabled: true } } })
            }
        })
        node.outgoingApp.forEach((out) => {
            const outNode = innOgUtNoder.get(out.id)
            if (outNode) {
                data.edges.push({ from: node.id, to: outNode.id, arrows: { to: { enabled: true } } })
            }
        })
        if (node.nodeType == 'app') {
            node.writeTopic.forEach((out) => {
                const outNode = innOgUtNoder.get(out.id)
                if (outNode) {
                    data.edges.push({ from: node.id, to: outNode.id, arrows: { to: { enabled: true } } })
                }
            })
            node.readTopic.forEach((out) => {
                const outNode = innOgUtNoder.get(out.id)
                if (outNode) {
                    data.edges.push({ from: node.id, to: outNode.id, arrows: { from: { enabled: true } } })
                }
            })
        }
    })
    return data
}
