'use client'
import React, { ReactElement, useEffect } from 'react'

export function ProdRedirect(): ReactElement {
    useEffect(() => {
        if (window.location.href.includes('flex-arkitektur.intern.nav.no')) {
            window.location.href = window.location.href.replace(
                'flex-arkitektur.intern.nav.no',
                'flex-arkitektur.nav.no',
            )
        }
    }, [])
    return <></>
}
