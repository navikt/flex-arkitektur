import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery'
import { logger } from '@navikt/next-logger'

import { isLocalOrDemo } from '@/utlis/env'
import { NaisApp } from '@/types'
import { naisAppTestdata } from '@/bigquery/testdata'

export async function hentNaisApper(): Promise<NaisApp[]> {
    if (isLocalOrDemo && process.env.LOCAL_TESTDATA === 'true') {
        logger.info('Henter naisapper fra lokal testdata')

        return mapResponse(naisAppTestdata)
    }
    logger.info('Henter naisapper fra bigquery')

    const options: BigQueryOptions = {}
    if (process.env.GOOGLE_CLOUD_PROJECT) {
        options.projectId = process.env.GOOGLE_CLOUD_PROJECT
    }
    const bigquery = new BigQuery(options)
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
    return mapResponse(rows)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResponse(rows: any[]): NaisApp[] {
    return rows.map((row) => {
        const newVar: NaisApp = {
            name: row.name,
            cluster: row.cluster,
            namespace: row.namespace,
        }

        function parseOgSett(
            key: 'ingresses' | 'inbound_apps' | 'outbound_apps' | 'read_topics' | 'write_topics' | 'outbound_hosts',
        ): void {
            const data = parseStringArray(row[key])
            if (data && data.length > 0) {
                newVar[key] = data
            }
        }

        parseOgSett('write_topics')
        parseOgSett('ingresses')
        parseOgSett('inbound_apps')
        parseOgSett('outbound_apps')
        parseOgSett('read_topics')
        parseOgSett('write_topics')
        parseOgSett('outbound_hosts')

        return newVar
    })
}

function parseStringArray(stringArray: [] | string): string[] | undefined {
    // hvis stringArray er et array
    if (Array.isArray(stringArray)) {
        return stringArray.filter((item: string) => !item.includes('kafka-canary'))
    }
    return JSON.parse(stringArray)
}
