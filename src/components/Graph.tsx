import { ReactElement, useEffect, useRef } from 'react'
import { Network } from 'vis-network'

import { NaisApp } from '@/types'

export function Graph({ apper, namespaces }: { apper: NaisApp[]; namespaces: string[] }): ReactElement {
    const container = useRef(null)

    const filtreteApper = apper.filter((app) => namespaces.includes(app.namespace))

    const nodes = filtreteApper.map((app) => ({ id: name(app), label: app.name }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const edges = [] as { from: string; to: string }[] //TODO memo

    filtreteApper.forEach((app) => {
        app.outbound_apps?.forEach((outboundApp) => {
            edges.push({ from: name(app), to: outboundApp })
        })
    })

    useEffect(() => {
        container.current && new Network(container.current, { nodes, edges }, {})
    }, [container, nodes, edges])

    return <div ref={container} style={{ height: 'calc(100vh - var(--a-spacing-32))' }} />
}

function name(app: NaisApp): string {
    return `${app.cluster}.${app.namespace}.${app.name}`
}
