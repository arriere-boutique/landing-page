import { Node } from "tiptap";
import GalleryCompact from '@/components/interactive/gallery-compact'

export default class Gallery extends Node {
  get name() {
    return "gallery";
  }

  get schema() {
    return {
      attrs: {
        medias: {
          default: ""
        }
      },
      group: "block",
      parseDOM: [
        {
          tag: "div[data-medias]",
          getAttrs: dom => ({
            medias: JSON.parse(dom.getAttribute("data-medias"))
          })
        }
      ],
      toDOM: node => ["div", {
            ['data-medias']: JSON.stringify(node.attrs.medias).replace('&quot;', `'`)
        }
      ]
    };
  }

    get view() {
        return GalleryCompact
    }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;
      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node);
      dispatch(transaction);
    };
  }
}