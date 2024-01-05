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
    const cluster = params.get('cluster') || 'prod'

    if (!cachedData || currentTime - lastFetchTime > 3600000 * cacheTimer) {
        logger.info('Henter naisapper fra bigquery')
        cachedData = await hentNaisApper()
        lastFetchTime = currentTime
    }
    const nextResponse = NextResponse.json(cachedData.filter((app) => app.cluster.includes(cluster)))
    // TODO øk fra 10 sekunder når ting er stabilt
    nextResponse.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=10')

    return nextResponse
}
