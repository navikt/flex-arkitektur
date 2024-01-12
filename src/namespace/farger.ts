const farger = [
    'bg-blue-500',
    'bg-orange-500',
    'bg-lightblue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-deepblue-500',
    'bg-purple-500',
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
        .getPropertyValue('--a-' + namespaceToAkselColor(namespace).replace('bg-', ''))
        .trim()
}

function randomColorFromHash(namespace: string): string {
    const hash = namespace.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return farger[hash % farger.length]
}
