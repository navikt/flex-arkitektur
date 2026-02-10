'use client'

import NextLink from 'next/link'
import { InternalHeader } from '@navikt/ds-react'
import React, { PropsWithChildren, ReactElement } from 'react'

export function NextInternalHeaderLink({
    href,
    children,
    selected,
}: PropsWithChildren<{ href: string; selected?: boolean }>): ReactElement {
    return (
        <InternalHeader.Title
            as={NextLink}
            href={href}
            className={selected ? 'font-semibold underline underline-offset-4' : ''}
        >
            {children}
        </InternalHeader.Title>
    )
}
