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
    nivaaerInn: number,
    nivaaerUt: number,
): NoderOgKanter {
    const noderBerort = new Map<string, ArkitekturNode>()

    filtreteApper.forEach((node) => noderBerort.set(node.id, node))

    function parseUtgaende(niva: number): void {
        //klone noderberort map
        const klon = new Map<string, ArkitekturNode>()
        noderBerort.forEach((node) => klon.set(node.id, node))

        if (niva > nivaaerUt) return
        klon.forEach((node) => {
            node.outgoingApp.forEach((out) => {
                noderBerort.set(out.id, out)
            })
            node.outgoingHost.forEach((out) => {
                noderBerort.set(out.id, out)
            })
            if (visKafka) {
                node.writeTopic.forEach((out) => {
                    noderBerort.set(out.id, out)
                })
            }
        })
        parseUtgaende(niva + 1)
    }

    function parseInngaende(niva: number): void {
        const klon = new Map<string, ArkitekturNode>()
        noderBerort.forEach((node) => klon.set(node.id, node))

        if (niva > nivaaerInn) return
        klon.forEach((node) => {
            node.incomingApp.forEach((inn) => {
                noderBerort.set(inn.id, inn)
            })
            if (visKafka) {
                node.readTopic.forEach((inn) => {
                    noderBerort.set(inn.id, inn)
                })
            }
            // TODO incoming for host må funke?
        })
        parseInngaende(niva + 1)
    }

    parseUtgaende(1)
    parseInngaende(1)
    const data: NoderOgKanter = {
        nodes: [],
        edges: [],
    }

    noderBerort.forEach((node) => {
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
            const outNode = noderBerort.get(out.id)
            if (outNode) {
                data.edges.push({ from: node.id, to: outNode.id, arrows: { to: { enabled: true } } })
            }
        })
        node.outgoingApp.forEach((out) => {
            const outNode = noderBerort.get(out.id)
            if (outNode) {
                data.edges.push({ from: node.id, to: outNode.id, arrows: { to: { enabled: true } } })
            }
        })
        if (node.nodeType == 'app') {
            node.writeTopic.forEach((out) => {
                const outNode = noderBerort.get(out.id)
                if (outNode) {
                    data.edges.push({ from: node.id, to: outNode.id, arrows: { to: { enabled: true } } })
                }
            })
            node.readTopic.forEach((out) => {
                const outNode = noderBerort.get(out.id)
                if (outNode) {
                    data.edges.push({ from: node.id, to: outNode.id, arrows: { from: { enabled: true } } })
                }
            })
        }
    })
    return data
}
