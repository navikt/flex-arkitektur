export function namespaceToEmoji(visEmoji: boolean, namespace: string | undefined): string {
    if (!visEmoji) return ''
    if (!namespace) return ''
    return namespaceToEmojiEkte(namespace) + '\n'
}

function namespaceToEmojiEkte(namespace: string): string {
    switch (namespace) {
        case 'teamsykmelding':
            return '💉'
        case 'flex':
            return '💪'
        case 'team-esyfo':
            return '🫂'
        case 'risk':
            return '☣️'
        case 'teamsykefravr':
            return '🏥'
        case 'helsearbeidsgiver':
            return '🧑‍💼'
        case 'personbruker':
            return '🧑🏽'
        default:
            return randomEmojiFromHash(namespace)
    }
}

function randomEmojiFromHash(namespace: string): string {
    const emojies = ['👾', '🤖', '👽', '👻', '👹', '🤡', '👁', '👀', '🧠', '🦾', '🦿', '🧬', '🧫', '🧪']
    const hash = namespace.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return emojies[hash % emojies.length]
}
