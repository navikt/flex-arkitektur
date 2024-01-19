import { NaisApp } from '@/types'
import { databaser } from '@/databaser/databaser'

export type NodeType = 'app' | 'topic' | 'ekstern' | 'database'

export class ArkitekturNode {
    public outgoingApp = new Set<ArkitekturNode>()
    public incomingApp = new Set<ArkitekturNode>()
    public writeTopic = new Set<ArkitekturNode>()
    public readTopic = new Set<ArkitekturNode>()
    public outgoingHost = new Set<ArkitekturNode>()
    public blirKalltAvApp = new Set<ArkitekturNode>()
    public blirLestAvApp = new Set<ArkitekturNode>()
    public blirSkrevetTilAvApp = new Set<ArkitekturNode>()
    public harDatabase = new Set<ArkitekturNode>()
    public erDatabaseSomBlirBruktAv = new Set<ArkitekturNode>()

    constructor(
        public id: string,
        public navn: string,
        public namespace: string | undefined,
        public nodeType: NodeType,
    ) {}
}

export function kalkulerNoder(data: NaisApp[]): ArkitekturNode[] {
    const nodeMap = new Map<string, ArkitekturNode>()
    const ingessMap = new Map<string, ArkitekturNode>()
    data.forEach((app) => {
        const arkitekturNode = new ArkitekturNode(name(app), app.name, app.namespace, 'app')
        nodeMap.set(name(app), arkitekturNode)
        app.ingresses?.forEach((ingress) => {
            //Fjerner trailing slash hvis den finnes
            if (ingress.endsWith('/')) {
                ingress = ingress.slice(0, -1)
            }

            ingessMap.set(ingress, arkitekturNode)
        })
    })

    data.forEach((app) => {
        app.outbound_hosts?.forEach((hostUrl) => {
            const fssExternalHost = ingessMap.get('https://' + hostUrl)
            const appArkitekturnode = nodeMap.get(name(app))
            if (!appArkitekturnode) {
                throw new Error('appArkitekturnode is undefined')
            }
            if (fssExternalHost) {
                appArkitekturnode.outgoingApp.add(fssExternalHost)
                fssExternalHost.incomingApp.add(appArkitekturnode)
                return
            }
            let outHost = nodeMap.get(hostUrl)
            if (!outHost) {
                outHost = new ArkitekturNode(hostUrl, hostUrl, undefined, 'ekstern')
                nodeMap.set(hostUrl, outHost)
            }

            appArkitekturnode.outgoingHost.add(outHost)
            outHost.blirKalltAvApp.add(appArkitekturnode)
        })
    })
    data.forEach((app) => {
        app.outbound_apps?.forEach((outboundApp) => {
            const out = nodeMap.get(outboundApp)
            if (out) {
                nodeMap.get(name(app))?.outgoingApp.add(out)
                out.incomingApp.add(nodeMap.get(name(app)) as ArkitekturNode)
            }
        })
    })
    data.forEach((app) => {
        app.write_topics?.forEach((topic) => {
            const namespace = topic.split('.')[1]
            const topicNavn = topic.split('.')[2]
            nodeMap.set(topic, new ArkitekturNode(topic, topicNavn, namespace, 'topic'))
        })
        app.read_topics?.forEach((topic) => {
            const namespace = topic.split('.')[1]
            const topicNavn = topic.split('.')[2]
            nodeMap.set(topic, new ArkitekturNode(topic, topicNavn, namespace, 'topic'))
        })
    })
    data.forEach((app) => {
        app.write_topics?.forEach((topic) => {
            const topicet = nodeMap.get(topic)
            if (topicet) {
                nodeMap.get(name(app))?.writeTopic.add(topicet)
                topicet.blirSkrevetTilAvApp.add(nodeMap.get(name(app)) as ArkitekturNode)
            }
        })
        app.read_topics?.forEach((topic) => {
            const topicet = nodeMap.get(topic)
            if (topicet) {
                nodeMap.get(name(app))?.readTopic.add(topicet)
                topicet.blirLestAvApp.add(nodeMap.get(name(app)) as ArkitekturNode)
            }
        })
    })
    databaser.forEach((app) => {
        app.databases.forEach((database) => {
            const id = app.namespace + '.' + app.appName + '.' + database
            const databaseNode = new ArkitekturNode(id, database, app.namespace, 'database')
            nodeMap.set(id, databaseNode)
        })
    })

    databaser.forEach((app) => {
        app.databases.forEach((database) => {
            const id = app.namespace + '.' + app.appName + '.' + database
            const databaseNode = nodeMap.get(id)!

            function finnApp(): ArkitekturNode | undefined {
                const prod = nodeMap.get('prod-gcp' + '.' + app.namespace + '.' + app.appName)
                if (prod) {
                    return prod
                }
                const dev = nodeMap.get('prod-gcp' + '.' + app.namespace + '.' + app.appName)
                if (dev) {
                    return dev
                }
                return undefined
            }
            const appen = finnApp()
            if (appen) {
                databaseNode.erDatabaseSomBlirBruktAv.add(appen)
                appen.harDatabase.add(databaseNode)
            }
        })
    })
    const nodeArray = [] as ArkitekturNode[]

    nodeMap.forEach((value) => {
        nodeArray.push(value)
    })
    return nodeArray
}

function name(app: NaisApp): string {
    return `${app.cluster}.${app.namespace}.${app.name}`
}
