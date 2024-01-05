import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'

let cachedData: App[] | undefined = undefined
let lastFetchTime = 0

export async function GET(req: Request): Promise<NextResponse<App[]>> {
    const currentTime = Date.now()
    const params = new URL(req.url).searchParams
    const cacheTimer = 6
    const cluster = params.get('cluster') || 'prod'

    if (!cachedData || currentTime - lastFetchTime > 3600000 * cacheTimer) {
        logger.info('Henter naisapper fra bigquery')
        const bigquery = new BigQuery()
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

        cachedData = rows.map((row) => {
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
        lastFetchTime = currentTime
    }
    const nextResponse = NextResponse.json(cachedData.filter((app) => app.cluster.includes(cluster)))
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600')

    return nextResponse
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
