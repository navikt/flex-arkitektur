export function namespaceToColor(namespace: string): string {
    switch (namespace) {
        case 'teamsykmelding':
            return 'red'
        case 'flex':
            return 'blue'
        case 'team-esyfo':
            return 'green'
        case 'risk':
            return 'yellow'
        case 'tbs':
            return 'pink'
        case 'teamsykefravr':
            return 'grey'
        case 'helsearbeidsgiver':
            return 'purple'
        case 'personbruker':
            return 'orange'
        default:
            return randomColorFromHash(namespace)
    }
}

function randomColorFromHash(namespace: string): string {
    const colors = ['red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'cyan', 'teal', 'indigo']
    const hash = namespace.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
}
