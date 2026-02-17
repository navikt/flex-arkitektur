export interface NaisApp {
    name: string
    cluster: string
    namespace: string
    ingresses?: string[]
    inbound_apps?: string[]
    outbound_apps?: string[]
    outbound_hosts?: string[]
    read_topics?: string[]
    write_topics?: string[]
}

export interface TbdRapidData {
    producers: RapidEvent[]
    consumers: RapidEvent[]
}

export interface RapidEvent {
    app: string
    namespace: string
    event_name: string
}

export interface PrometheusResponse {
    status: string
    data: {
        resultType: string
        result: Array<{
            metric: {
                app: string
                behov: string
                losninger: string
                participating_services: string
                namespace: string
                event_name: string
                river?: string
            }
            value: [number, string]
        }>
    }
}
