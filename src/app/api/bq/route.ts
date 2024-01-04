export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'

export async function GET(): Promise<NextResponse<App[]>> {
    const bigquery = new BigQuery()

    const query = `SELECT name,
                          collection_time,
                          cluster,
                          namespace,
                          team,
                          ingresses,
                          inbound_apps,
                          outbound_apps,
                          outbound_hosts,
                          read_topics,
                          write_topics
                   FROM \` aura-prod-d7e3.dataproduct_apps.dataproduct_apps_unique_v3\`
                   WHERE dato = (SELECT MAX(dato) FROM \`aura-prod-d7e3.dataproduct_apps.dataproduct_apps_unique_v3\`)`

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'europe-north1',
    }

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options)

    // Wait for the query to finish
    const [rows] = await job.getQueryResults()
    // Print the results

    return NextResponse.json(rows)
}

interface App {
    name: string
    collection_time: string
    cluster: string
    namespace: string
    team: string
    ingresses: string
    inbound_apps: string
    outbound_apps: string
    outbound_hosts: string
    read_topics: string
    write_topics: string
}
