const farger = [
    'bg-ax-accent-600',
    'bg-ax-warning-600',
    'bg-ax-brand-blue-900',
    'bg-ax-success-600',
    'bg-ax-danger-600',
    'bg-ax-brand-blue-600',
    'bg-ax-meta-purple-600',
]

export function namespaceToAkselColor(namespace: string): string {
    switch (namespace) {
        case 'flex':
            return farger[0]
        case 'teamsykmelding':
            return farger[1]
        case 'team-esyfo':
            return farger[2]
        case 'risk':
            return farger[3]
        case 'tbd':
            return farger[4]
        case 'teamsykefravr':
            return farger[5]
        case 'helsearbeidsgiver':
            return farger[6]
        default:
            return randomColorFromHash(namespace)
    }
}

export function namespaceToColor(namespace: string): string {
    const root = document.documentElement
    return getComputedStyle(root)
        .getPropertyValue('--' + namespaceToAkselColor(namespace).replace('bg-', ''))
        .trim()
}

function randomColorFromHash(namespace: string): string {
    const hash = namespace.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return farger[hash % farger.length]
}
