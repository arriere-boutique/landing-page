import { Node } from 'tiptap'
import { wrapIn } from 'prosemirror-commands'

export default class StyledBlock extends Node {

    get name() {
        return 'styledBlock'
    }

    get schema() {
        return {
            attrs: {
                block: { default: 'no' },
            },
            content: 'block*',
            group: 'block',
            defining: true,
            isolating: true,
            draggable: false,
            parseDOM: [{
                tag: '.Block',
                getAttrs: dom => {
                    return {
                        block: dom.getAttribute('class').replace('Block Block--', '')
                    }
                },
            }],
            toDOM: node => ['div', {
                class: `Block Block--${node.attrs.block}`
            }, 0]
        }
    }

    commands({ type, schema }) {
        return attrs => wrapIn(type, attrs)
    }
}