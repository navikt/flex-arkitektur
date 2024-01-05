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
