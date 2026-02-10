import { Edge, Node } from 'vis-network'

import { RapidNode } from '@/nodes/kalkulerRapidNoder'

export interface RapidEdge extends Edge {
    events?: string[]
    fullLabel?: string
    fromNodeName?: string
    toNodeName?: string
}

export interface NoderOgKanter {
    nodes: Node[]
    edges: RapidEdge[]
}

interface KalkulasjonOptions {
    filtrerteNoder: RapidNode[]
    sokemetode: string
    valgteEvents: string[]
    ekskluderteEvents: string[]
    maxChars?: number
}

function truncateLabel(events: string[], maxChars: number): string {
    const joined = events.join(', ')
    if (joined.length <= maxChars) return joined
    return joined.substring(0, maxChars - 3) + '...'
}

export function kalkulerRapidNoderOgKanter({
    filtrerteNoder,
    sokemetode,
    valgteEvents,
    ekskluderteEvents,
    maxChars,
}: KalkulasjonOptions): NoderOgKanter {
    const data: NoderOgKanter = {
        nodes: [],
        edges: [],
    }

    const nodeIds = new Set(filtrerteNoder.map((n) => n.id))

    // Map for å samle events per kant-par (source->target)
    const edgeMap = new Map<string, { events: string[]; from: string; to: string; fromName: string; toName: string }>()

    // Lag en map fra id til node-navn
    const nodeNavnMap = new Map<string, string>()
    filtrerteNoder.forEach((node) => {
        nodeNavnMap.set(node.id, node.navn)
    })

    // Event filter for å begrense hvilke kanter som vises
    const valgteEventSet = sokemetode === 'event' && valgteEvents.length > 0 ? new Set(valgteEvents) : null
    const ekskluderteEventSet = new Set(ekskluderteEvents)

    filtrerteNoder.forEach((node) => {
        data.nodes.push({
            id: node.id,
            label: node.navn,
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

        // Samle events per kant-par (source -> target)
        node.produceEvents.forEach((consumers, eventName) => {
            // Filtrer events hvis event-filter er aktivt
            if (valgteEventSet && !valgteEventSet.has(eventName)) return

            // Ekskluder events som er i ekskludert-listen
            if (ekskluderteEventSet.has(eventName)) return

            consumers.forEach((consumer) => {
                // Bare samle kanter til noder som finnes i filtrerte noder
                if (!nodeIds.has(consumer.id)) return

                const edgeKey = `${node.id}->${consumer.id}`
                if (!edgeMap.has(edgeKey)) {
                    edgeMap.set(edgeKey, {
                        events: [],
                        from: node.id,
                        to: consumer.id,
                        fromName: node.navn,
                        toName: nodeNavnMap.get(consumer.id) || consumer.id,
                    })
                }
                const entry = edgeMap.get(edgeKey)!
                if (!entry.events.includes(eventName)) {
                    entry.events.push(eventName)
                }
            })
        })
    })

    // Konverter samlet edge map til edges
    edgeMap.forEach((entry, key) => {
        const fullLabel = entry.events.join(', ')
        const label = maxChars != null ? truncateLabel(entry.events, maxChars) : fullLabel

        data.edges.push({
            id: key,
            from: entry.from,
            to: entry.to,
            label: label,
            fullLabel: fullLabel,
            events: entry.events,
            fromNodeName: entry.fromName,
            toNodeName: entry.toName,
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

    return data
}
