import { ArkitekturNode } from '@/nodes/kalkulerNoder'
import { TrieNode } from '@/trie/TrieNode'

export class Trie {
    private root: TrieNode

    constructor() {
        this.root = new TrieNode()
    }

    insert(word: string, arkitekturNode: ArkitekturNode): void {
        let node = this.root
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode())
            }
            node = node.children.get(char)!
        }
        node.isEndOfWord = true
        node.word = word
        node.arkitekturNode = arkitekturNode
    }

    findAllWithPrefix(prefix: string): Array<ArkitekturNode> {
        let node = this.root
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return []
            }
            node = node.children.get(char)!
        }
        return this._findAllWords(node)
    }

    private _findAllWords(node: TrieNode): Array<ArkitekturNode> {
        let arkitekturNodes: Array<ArkitekturNode> = []
        if (node.isEndOfWord && node.arkitekturNode) {
            arkitekturNodes.push(node.arkitekturNode)
        }

        for (const childNode of node.children.values()) {
            arkitekturNodes = arkitekturNodes.concat(this._findAllWords(childNode))
        }

        return arkitekturNodes
    }
}
