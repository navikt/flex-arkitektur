import { ArkitekturNode } from '@/nodes/kalkulerNoder'

export class TrieNode {
    public children: Map<string, TrieNode>
    public isEndOfWord: boolean
    public word: string | null
    public arkitekturNode: ArkitekturNode[]

    constructor() {
        this.children = new Map()
        this.isEndOfWord = false
        this.word = null
        this.arkitekturNode = []
    }
}
