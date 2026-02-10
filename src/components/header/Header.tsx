'use client'

import React, { ReactElement } from 'react'
import { InternalHeader, Spacer } from '@navikt/ds-react'
import { usePathname } from 'next/navigation'

import { NextInternalHeaderLink } from './NextInternalHeaderLink'

export function Header(): ReactElement {
    const pathname = usePathname()

    const navItems = [
        { href: '/', label: 'Arkitektur' },
        { href: '/po-helse', label: 'PO Helse' },
        { href: '/tbd-rapid', label: 'TBD Rapid' },
    ]

    return (
        <InternalHeader className="h-14">
            <NextInternalHeaderLink href="/">Flex Arkitektur</NextInternalHeaderLink>
            {navItems.map(({ href, label }) => (
                <NextInternalHeaderLink key={href} href={href} selected={pathname === href}>
                    {label}
                </NextInternalHeaderLink>
            ))}
            <Spacer />
        </InternalHeader>
    )
}
