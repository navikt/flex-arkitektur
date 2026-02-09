import { RapidNode } from '@/nodes/kalkulerRapidNoder'

export function filtrerRapidNoder(
    noder: RapidNode[],
    sokemetode: string,
    valgteApper: string[],
    valgteEvents: string[],
    ekskluderteEvents: string[] = [],
    inkluderNaboer: boolean = true,
): RapidNode[] {
    const ekskluderteEventSet = new Set(ekskluderteEvents)

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

        return noder.filter((node) => {
            // Sjekk om noden produserer noen av de valgte eventene
            for (const eventName of node.produceEvents.keys()) {
                if (valgteEventSet.has(eventName)) return true
            }

            // Sjekk om noden konsumerer noen av de valgte eventene
            for (const eventName of node.consumeEvents.keys()) {
                if (valgteEventSet.has(eventName)) return true
            }

            return false
        })
    }

    // Ingen filter satt - vis alle
    return noder
}
