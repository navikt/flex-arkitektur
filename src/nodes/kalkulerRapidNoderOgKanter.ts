import { Edge, Node } from 'vis-network'

import { RapidNode } from '@/nodes/kalkulerRapidNoder'

interface NoderOgKanter {
    nodes: Node[]
    edges: Edge[]
}

interface KalkulasjonOptions {
    filtrerteNoder: RapidNode[]
    sokemetode: string
    valgteEvents: string[]
    ekskluderteEvents: string[]
}

export function kalkulerRapidNoderOgKanter({
    filtrerteNoder,
    sokemetode,
    valgteEvents,
    ekskluderteEvents,
}: KalkulasjonOptions): NoderOgKanter {
    const data: NoderOgKanter = {
        nodes: [],
        edges: [],
    }

    const nodeIds = new Set(filtrerteNoder.map((n) => n.id))
    const edgeIds = new Set<string>()

    // Event filter for å begrense hvilke kanter som vises
    const valgteEventSet = sokemetode === 'event' && valgteEvents.length > 0 ? new Set(valgteEvents) : null
    const ekskluderteEventSet = new Set(ekskluderteEvents)

    filtrerteNoder.forEach((node) => {
        data.nodes.push({
            id: node.id,
            label: `${node.navn}\n\napplikasjon`,
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

        // Opprett kanter fra producer til consumers
        node.produceEvents.forEach((consumers, eventName) => {
            // Filtrer events hvis event-filter er aktivt
            if (valgteEventSet && !valgteEventSet.has(eventName)) return

            // Ekskluder events som er i ekskludert-listen
            if (ekskluderteEventSet.has(eventName)) return

            consumers.forEach((consumer) => {
                // Bare opprett kanter til noder som finnes i filtrerte noder
                if (!nodeIds.has(consumer.id)) return

                const edgeId = `${node.id}-${eventName}-${consumer.id}`
                if (edgeIds.has(edgeId)) return
                edgeIds.add(edgeId)

                data.edges.push({
                    id: edgeId,
                    from: node.id,
                    to: consumer.id,
                    label: eventName,
                    arrows: { to: { enabled: true } },
                    font: {
                        align: 'middle',
                        size: 10,
                        face: 'monospace',
                        strokeWidth: 3,
                        strokeColor: '#ffffff',
                    },
                })
            })
        })
    })

    return data
}
