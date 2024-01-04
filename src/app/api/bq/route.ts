export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { BigQuery } from '@google-cloud/bigquery'
import { logger } from '@navikt/next-logger'

export async function GET(req: Request): Promise<NextResponse<Record<string, string>>> {
    try {
        const text = await req.text()
        logger.info('bq api request' + text)

        const bigquery = new BigQuery()

        const query = `SELECT name, cluster
                       FROM \`aura-prod-d7e3.dataproduct_apps.dataproduct_apps_unique_v3\`
                       where team = 'flex'
                       LIMIT 20`

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
        logger.info('bq api request' + JSON.stringify(rows))
        // Print the results

        return NextResponse.json({ res: JSON.stringify(rows), ok: 'true' })
    } catch (error) {
        logger.error('bq api request' + error)
        return NextResponse.json({ res: JSON.stringify(error), error: 'true' })
    }
}
