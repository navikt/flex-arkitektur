export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'

export async function GET(req: Request): Promise<NextResponse<App[]>> {
    const bigquery = new BigQuery()
    const params = new URL(req.url).searchParams
    const cluster = params.get('cluster') || 'prod'
    const bqTabell = '`aura-prod-d7e3.dataproduct_apps.dataproduct_apps_unique_v3`'
    const query = `SELECT name,
                          cluster,
                          namespace,
                          ingresses,
                          inbound_apps,
                          outbound_apps,
                          outbound_hosts,
                          read_topics,
                          write_topics
                   FROM ${bqTabell}
                   WHERE dato = (SELECT MAX(dato) FROM ${bqTabell})`

    const [job] = await bigquery.createQueryJob({
        query: query,
        location: 'europe-north1',
    })

    const [rows] = await job.getQueryResults()

    const apps: App[] = rows.map((row) => {
        return {
            name: row.name,
            cluster: row.cluster,
            namespace: row.namespace,
            ingresses: row.ingresses,
            inbound_apps: row.inbound_apps,
            outbound_apps: row.outbound_apps,
            outbound_hosts: row.outbound_hosts,
            read_topics: row.read_topics,
            write_topics: row.write_topics,
        }
    })

    return NextResponse.json(apps.filter((app) => app.cluster.includes(cluster)))
}

interface App {
    name: string
    cluster: string
    namespace: string
    ingresses: string
    inbound_apps: string
    outbound_apps: string
    outbound_hosts: string
    read_topics: string
    write_topics: string
}
