import { logger } from '@navikt/next-logger'
import { NextResponse } from 'next/server'

import { hentNaisApper } from '@/bigquery/naisAppsFetching'
import { NaisApp } from '@/types'
import { verifyUserLoggedIn } from '@/auth/authentication'

let cachedData: NaisApp[] | undefined = undefined
let lastFetchTime = 0

export async function GET(req: Request): Promise<NextResponse<NaisApp[]>> {
    await verifyUserLoggedIn()
    const currentTime = Date.now()
    const params = new URL(req.url).searchParams
    const cacheTimer = 6
    const cluster = params.get('env') || 'prod'

    if (!cachedData || currentTime - lastFetchTime > 3600000 * cacheTimer) {
        cachedData = await hentNaisApper()
        lastFetchTime = currentTime
    } else {
        logger.info('Henter naisapper fra cache')
    }
    const nextResponse = NextResponse.json(cachedData.filter((app) => app.cluster.includes(cluster)))
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300')

    return nextResponse
}
