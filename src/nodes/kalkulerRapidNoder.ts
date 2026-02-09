import { TbdRapidData } from '@/types'

export class RapidNode {
    public produceEvents = new Map<string, Set<RapidNode>>()
    public consumeEvents = new Map<string, Set<RapidNode>>()

    constructor(
        public id: string,
        public navn: string,
        public namespace: string,
    ) {}
}

export function kalkulerRapidNoder(data: TbdRapidData): RapidNode[] {
    const nodeMap = new Map<string, RapidNode>()

    // Opprett noder for alle unike apper fra producers og consumers
    const alleEvents = [...data.producers, ...data.consumers]
    alleEvents.forEach((event) => {
        const id = `${event.namespace}.${event.app}`
        if (!nodeMap.has(id)) {
            nodeMap.set(id, new RapidNode(id, event.app, event.namespace))
        }
    })

    // Bygg event_name -> producers map
    const eventProducers = new Map<string, Set<RapidNode>>()
    data.producers.forEach((event) => {
        const id = `${event.namespace}.${event.app}`
        const node = nodeMap.get(id)!
        if (!eventProducers.has(event.event_name)) {
            eventProducers.set(event.event_name, new Set())
        }
        eventProducers.get(event.event_name)!.add(node)
    })

    // Bygg event_name -> consumers map
    const eventConsumers = new Map<string, Set<RapidNode>>()
    data.consumers.forEach((event) => {
        const id = `${event.namespace}.${event.app}`
        const node = nodeMap.get(id)!
        if (!eventConsumers.has(event.event_name)) {
            eventConsumers.set(event.event_name, new Set())
        }
        eventConsumers.get(event.event_name)!.add(node)
    })

    // Koble producers til consumers via event_name
    data.producers.forEach((event) => {
        const producerNode = nodeMap.get(`${event.namespace}.${event.app}`)!
        const consumers = eventConsumers.get(event.event_name)
        if (consumers) {
            producerNode.produceEvents.set(event.event_name, consumers)
        }
    })

    // Koble consumers til producers via event_name
    data.consumers.forEach((event) => {
        const consumerNode = nodeMap.get(`${event.namespace}.${event.app}`)!
        const producers = eventProducers.get(event.event_name)
        if (producers) {
            consumerNode.consumeEvents.set(event.event_name, producers)
        }
    })

    return Array.from(nodeMap.values())
}
