import { Mark } from 'tiptap'
import { updateMark, removeMark } from 'tiptap-commands'

import LinkBase from '@/components/base/link-base'

export default class Link extends Mark {

    get name() {
        return 'link'
    }

    get schema() {
        return {
            attrs: {
                link: { default: null },
                target: { default: '_self' },
                context: { default: null }
            },
            inclusive: false,
            parseDOM: [{
                tag: 'a[data-context]',
                getAttrs: dom => {
                    return {
                        link: dom.getAttribute('href'),
                        target: dom.getAttribute('target'),
                        context: JSON.parse(dom.getAttribute('data-context')),
                    }
                },
            }],
            toDOM: node => ['a', {
                ['data-context']: JSON.stringify(node.attrs.context).replace('&quot;', `'`),
                href: node.attrs.link,
                target: node.attrs.target
            }, 0]
        }
    }

    commands({ type }) {
        return attrs => {
            if (attrs.link) {
                return updateMark(type, attrs)
            }

            return removeMark(type)
        }
    }

    // get view() {
    //     return LinkBase
    // }
}