import { headers } from 'next/headers'
import { logger } from '@navikt/next-logger'
import { validateAzureToken } from '@navikt/oasis'
import { redirect } from 'next/navigation'

import { isLocalOrDemo } from '@/utlis/env'

export async function verifyUserLoggedIn(): Promise<void> {
    const requestHeaders = headers()

    if (isLocalOrDemo) {
        logger.warn('Is running locally, skipping RSC auth')
        return
    }

    const redirectPath = requestHeaders.get('x-path')
    if (!redirectPath == null) {
        logger.warn("Missing 'x-path' header, is middleware middlewaring?")
    }

    const bearerToken: string | null | undefined = requestHeaders.get('authorization')
    if (!bearerToken) {
        logger.info('Found no token, redirecting to login')
        redirect(`/oauth2/login?redirect=${redirectPath}`)
    }

    const validationResult = await validateAzureToken(bearerToken)
    if (!validationResult.ok) {
        if (validationResult.errorType !== 'token expired') {
            logger.error(
                new Error(`Invalid JWT token found (cause: ${validationResult.errorType}, redirecting to login.`, {
                    cause: validationResult.error,
                }),
            )
        }
        redirect(`/oauth2/login?redirect=${redirectPath}`)
    }
}
