import { PrometheusResponse } from '@/types'

export class RapidNode {
    public produceEvents = new Map<string, Set<RapidNode>>()
    public consumeEvents = new Map<string, Set<RapidNode>>()
    // Behov: denne noden sender behov til target
    public sendBehov = new Map<string, RapidNode>()
    // Løsning: denne noden sender løsning til target
    public sendLosning = new Map<string, RapidNode>()

    constructor(
        public id: string,
        public navn: string,
        public namespace: string,
    ) {}
}

export function kalkulerRapidNoder(data: PrometheusResponse): RapidNode[] {
    const nodeMap = new Map<string, RapidNode>()

    // Opprett noder for alle unike apper fra Prometheus data
    data.data.result.forEach((item) => {
        const { app, namespace } = item.metric
        const id = `${namespace}.${app}`
        if (!nodeMap.has(id)) {
            nodeMap.set(id, new RapidNode(id, app, namespace))
        }

        // Håndter participating_services for å opprette alle noder
        if (item.metric.participating_services) {
            const services = item.metric.participating_services.split(',').map((s) => s.trim())
            services.forEach((service) => {
                const serviceId = `${namespace}.${service}`
                if (!nodeMap.has(serviceId)) {
                    nodeMap.set(serviceId, new RapidNode(serviceId, service, namespace))
                }
            })
        }
    })

    // Bygg relasjoner
    data.data.result.forEach((item) => {
        const { app, namespace, event_name, participating_services, losninger, behov } = item.metric

        // Spesialbehandling for behov events med behovsakkumulator
        if (event_name === 'behov' && app === 'behovsakkumulator' && participating_services) {
            const services = participating_services.split(',').map((s) => s.trim())
            const fromApp = services[0] // Første app sender behovet
            const toApp = services[1] // Andre app mottar behovet og sender løsning

            if (fromApp && toApp && losninger && losninger !== 'none') {
                const fromNode = nodeMap.get(`${namespace}.${fromApp}`)
                const toNode = nodeMap.get(`${namespace}.${toApp}`)

                if (fromNode && toNode) {
                    const losningListe = losninger.split(',').map((l) => l.trim())

                    // For hver løsning, opprett behov/løsning relasjoner
                    losningListe.forEach((losning) => {
                        // Behov: fromNode sender behov til toNode
                        fromNode.sendBehov.set(losning, toNode)

                        // Løsning: toNode sender løsning til fromNode
                        toNode.sendLosning.set(losning, fromNode)
                    })
                }
            }
        } else if (behov === 'none' && participating_services) {
            // Events som ikke er behov: første app sender til siste app
            const services = participating_services.split(',').map((s) => s.trim())
            if (services.length >= 2) {
                const fromApp = services[0]
                const toApp = services[services.length - 1]
                const fromNode = nodeMap.get(`${namespace}.${fromApp}`)
                const toNode = nodeMap.get(`${namespace}.${toApp}`)

                if (fromNode && toNode && fromNode !== toNode) {
                    if (!fromNode.produceEvents.has(event_name)) {
                        fromNode.produceEvents.set(event_name, new Set())
                    }
                    fromNode.produceEvents.get(event_name)!.add(toNode)

                    if (!toNode.consumeEvents.has(event_name)) {
                        toNode.consumeEvents.set(event_name, new Set())
                    }
                    toNode.consumeEvents.get(event_name)!.add(fromNode)
                }
            }
        } else {
            // Standard event håndtering (ikke behov)
            const producerNode = nodeMap.get(`${namespace}.${app}`)
            if (!producerNode) return

            // Finn alle konsumenter av dette eventet
            data.data.result.forEach((consumerItem) => {
                if (
                    consumerItem.metric.event_name === event_name &&
                    consumerItem.metric.app !== app &&
                    consumerItem.metric.participating_services
                ) {
                    const consumerServices = consumerItem.metric.participating_services.split(',').map((s) => s.trim())
                    if (consumerServices.includes(app)) {
                        // Dette er en konsument av eventet
                        consumerServices.forEach((service) => {
                            if (service !== app) {
                                const consumerNode = nodeMap.get(`${namespace}.${service}`)
                                if (consumerNode) {
                                    if (!producerNode.produceEvents.has(event_name)) {
                                        producerNode.produceEvents.set(event_name, new Set())
                                    }
                                    producerNode.produceEvents.get(event_name)!.add(consumerNode)

                                    if (!consumerNode.consumeEvents.has(event_name)) {
                                        consumerNode.consumeEvents.set(event_name, new Set())
                                    }
                                    consumerNode.consumeEvents.get(event_name)!.add(producerNode)
                                }
                            }
                        })
                    }
                }
            })
        }
    })

    return Array.from(nodeMap.values())
}
