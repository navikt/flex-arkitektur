import { RapidNode } from '@/nodes/kalkulerRapidNoder'

export function filtrerRapidNoder(
    noder: RapidNode[],
    sokemetode: string,
    valgteApper: string[],
    valgteEvents: string[],
    inkluderNaboer: boolean = true,
): RapidNode[] {
    const ekskluderteEventSet = new Set(['ping'])

    if (sokemetode === 'app' && valgteApper.length > 0) {
        const valgteNoderIds = new Set(valgteApper)

        if (!inkluderNaboer) {
            // Bare vis de valgte appene, ingen naboer
            return noder.filter((node) => valgteNoderIds.has(node.id))
        }

        // Finn valgte noder og alle noder som er koblet til dem via events
        const relatertNoderIds = new Set<string>()

        noder.forEach((node) => {
            if (!valgteNoderIds.has(node.id)) return

            // Inkluder noden selv
            relatertNoderIds.add(node.id)

            // Inkluder alle consumer-noder for events denne appen produserer (som ikke er ekskludert)
            node.produceEvents.forEach((consumers, eventName) => {
                if (ekskluderteEventSet.has(eventName)) return
                consumers.forEach((consumer) => relatertNoderIds.add(consumer.id))
            })

            // Inkluder alle producer-noder for events denne appen konsumerer (som ikke er ekskludert)
            node.consumeEvents.forEach((producers, eventName) => {
                if (ekskluderteEventSet.has(eventName)) return
                producers.forEach((producer) => relatertNoderIds.add(producer.id))
            })
        })

        return noder.filter((node) => relatertNoderIds.has(node.id))
    }

    if (sokemetode === 'event' && valgteEvents.length > 0) {
        const valgteEventSet = new Set(valgteEvents)
        const relatertNoderIds = new Set<string>()

        noder.forEach((node) => {
            // Sjekk om noden produserer noen av de valgte eventene
            for (const [eventName, consumers] of node.produceEvents.entries()) {
                if (valgteEventSet.has(eventName)) {
                    relatertNoderIds.add(node.id) // Inkluder producer
                    consumers.forEach((consumer) => relatertNoderIds.add(consumer.id)) // Inkluder alle consumers
                }
            }

            // Sjekk om noden konsumerer noen av de valgte eventene
            for (const [eventName, producers] of node.consumeEvents.entries()) {
                if (valgteEventSet.has(eventName)) {
                    relatertNoderIds.add(node.id) // Inkluder consumer
                    producers.forEach((producer) => relatertNoderIds.add(producer.id)) // Inkluder alle producers
                }
            }

            // Sjekk om noden sender behov (behov-X events)
            for (const [losning, targetNode] of node.sendBehov.entries()) {
                if (valgteEventSet.has(`behov-${losning}`)) {
                    relatertNoderIds.add(node.id) // Inkluder sender
                    relatertNoderIds.add(targetNode.id) // Inkluder mottaker
                }
            }

            // Sjekk om noden sender løsning (løsning-X events)
            for (const [losning, targetNode] of node.sendLosning.entries()) {
                if (valgteEventSet.has(`løsning-${losning}`)) {
                    relatertNoderIds.add(node.id) // Inkluder sender
                    relatertNoderIds.add(targetNode.id) // Inkluder mottaker
                }
            }
        })

        return noder.filter((node) => relatertNoderIds.has(node.id))
    }

    // Ingen filter satt - vis alle
    return noder
}
