import { Node } from 'tiptap'
import Insert from '@/components/inserts/insert' 

export default class InsertBlock extends Node {

    get name() {
        return 'insertBlock'
    }

    get schema() {

        return {
            group: 'block',
            attrs: {
                id: { default: '' }
            },
            toDOM: node => ['div', { ['data-insert-id']: node.attrs.id } ],
            parseDOM: [{
                tag: 'div[data-insert-id]',
                getAttrs: dom => ({ id: dom.getAttribute('data-insert-id') })
            }]
        }
    }

    get view() {
        return Insert
    }

    commands({ type }) {
        return attrs => (state, dispatch) => {
            const { selection } = state
            const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
            const node = type.create(attrs)
            const transaction = state.tr.insert(position, node)

            dispatch(transaction)
        }
    }
}