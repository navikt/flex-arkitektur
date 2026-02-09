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
