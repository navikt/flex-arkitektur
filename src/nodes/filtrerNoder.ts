import { ArkitekturNode } from '@/nodes/kalkulerNoder'

export function filtrerArkitekturNoder(
    arkitekturNoder: ArkitekturNode[],
    valgteNamespaces: string[],
    valgeApper: string[],
    initielleSlettedeNoder: string[],
    filter: string[],
    sokemetode: string,
): ArkitekturNode[] {
    return arkitekturNoder
        .filter((app) => {
            if (sokemetode !== 'namespace') return true
            if (app.namespace === undefined) return false
            return valgteNamespaces.includes(app.namespace)
        })
        .filter((app) => {
            if (sokemetode !== 'app') return true
            return valgeApper.includes(app.id)
        })
        .filter((app) => {
            return !initielleSlettedeNoder.includes(app.id)
        })
        .filter((app) => {
            if (filter.length === 0) {
                return true
            }
            return filter.some((f) => {
                return app.id.includes(f)
            })
        })
}
