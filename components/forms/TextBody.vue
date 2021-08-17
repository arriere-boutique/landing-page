<template>
    <div class="TextBody">
        <div class v-html="value" v-if="!editor"></div>
        <editor-content :editor="editor" ref="text" v-if="editor" />
    </div>
</template>

<script>
import { Editor, EditorContent } from 'tiptap'
import { Heading, Bold, Blockquote, Image, Italic, OrderedList, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/plugins/tiptap/Link'

export default {
    name: 'TextEditor',
    components: { EditorContent },
    props: {
        value: { type: String, default: '' }
    },
    data: () => ({
        editor: null
    }),
    async mounted () {
        this.$data.editor = new Editor({
            editable: false,
            extensions: [
                new Heading({ levels: [1, 2, 3] }),
                new Bold(), new Italic(),
                new OrderedList(), new BulletList(), new ListItem(),
                new Blockquote(),
                new Image(),
                new Link()
            ],
            content: this.$props.value,
        })
    }
}
</script>