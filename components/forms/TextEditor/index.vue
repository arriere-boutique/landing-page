<template>
    <div class="TextEditor">
        <editor-menu-bar :editor="editor" v-slot="{ isActive, getMarkAttrs, getNodeAttrs }" v-if="editable">
            <div class="TextEditor_menu">
                <div class="TextEditor_first">
                    <div class="TextEditor_group" v-for="(group, i) in groups" :key="i">
                        <component
                            v-for="command in group"
                            :is="command.component || 'button-editor'"
                            :is-active="isActive[command.id] ? isActive[command.id]() : false"
                            :icon="command.icon"
                            :current-node="command.isNode ? getNodeAttrs(command.value) : (command.isMark ? getMarkAttrs(command.value) : null)"
                            @click="command.setCurrent ? state.current = command.id : (command.command ? command.command() : editor.commands[command.id]())"
                            @update="(v) => command.onUpdate(v) || undefined"
                            :key="command.id"
                        />

                        <div class="TextEditor_separator"></div>
                    </div>
                </div>
            </div>
        </editor-menu-bar>

        <popin-link
            :is-active="state.current == 'linkSelect'"
            @input="editor.commands.link"
            @close="state.current = ''"
            v-if="editor"
        />

        <popin-youtube
            :is-active="state.current == 'iframe'"
            @input="insertIframe"
            @close="state.current = ''"
        />

        <div class="TextBody" v-html="value" v-if="!editor"></div>
        <editor-content class="TextEditor_content TextBody" :editor="editor" ref="text" v-if="editor" />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Blockquote, Image, History, Italic, OrderedList, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/plugins/tiptap/Link'
import Iframe from '@/plugins/tiptap/Iframe'
import Gallery from '@/plugins/tiptap/Gallery'
import InsertBlock from '@/plugins/tiptap/InsertBlock'
import StyledBlock from '@/plugins/tiptap/StyledBlock'
import ButtonEditor from '@/components/forms/TextEditor/components/button-editor'
import ButtonHeadings from '@/components/forms/TextEditor/components/button-headings'
import ButtonInsert from '@/components/forms/TextEditor/components/button-insert'
import ButtonBlocks from '@/components/forms/TextEditor/components/button-blocks'
import MediaLibrary from '@/components/interactive/media-library.vue'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, ButtonEditor, ButtonHeadings, ButtonInsert, ButtonBlocks, MediaLibrary },
    props: {
        value: { type: String, default: '' },
        editable: { type: Boolean, default: true }
    },
    data: () => ({
        state: {
            current: 'styleSelect'
        },
        editor: null,
        link: {
            href: '',
            blank: true
        },
        style: [],
        block: 'StyledBlock--pink',
        groups: []
    }),
    async mounted () {
        this.$data.editor = new Editor({
            editable: this.$props.editable,
            extensions: [
                new Heading({ levels: [1, 2, 3] }),
                new Bold(), new Italic(),
                new OrderedList(), new BulletList(), new ListItem(),
                new Blockquote(),
                new Image(),
                new History(),
                new Link(), new StyledBlock(), new Iframe, new Gallery(),
                new InsertBlock()
            ],
            content: this.$props.value,
        })

        this.$data.groups = [
            [
                { id: 'undo', label: 'Annuler', icon: 'undo-alt' },
                { id: 'redo', label: 'Rétablir', icon: 'redo-alt' }
            ], [
                { id: 'styleSelect', component: 'button-headings', value: 'heading', isNode: true, onUpdate: (v) => this.$data.editor.commands.heading({ level: v }) },
                { id: 'bold', label: 'Gras', icon: 'bold' },
                { id: 'italic', label: 'Italique', icon: 'italic' },
            ], [
                { id: 'fileSelect', label: 'Image', icon: 'image', command: () => this.$emit('open-library', {
                    props: { max: 1 }, onInput: (v) => this.insertImage(v)
                }) },
                { id: 'linkSelect', icon: 'link', setCurrent: true },
                { id: 'iframe', icon: 'play', setCurrent: true },
                { id: 'blockquote', label: 'Citation', icon: 'quote-right' },
                { id: 'bullet_list', label: 'Liste', icon: 'list-ul' },
                { id: 'ordered_list', label: 'Liste numérotée', icon: 'list-ol' },
                { id: 'gallery', label: 'Galerie', icon: 'images', command: () => this.$emit('open-library', {
                    props: { max: 3 }, onInput: (v) => this.insertGallery(v)
                }) },
            ], [
                { id: 'styledBlock', component: 'button-blocks', value: 'styledBlock', isNode: true, onUpdate: (v) => this.$data.editor.commands.styledBlock(v) },
                { id: 'insertBlock', component: 'button-insert', value: 'insertBlock', isNode: true, onUpdate: (v) => this.$data.editor.commands.insertBlock(v) },
            ]
        ]

        this.$data.editor.on('update', () => this.onUpdate())
        setTimeout(() => this.onUpdate(), 100)
    },
    methods: {
        onUpdate () {
            this.$emit('input', this.$data.editor.getHTML())
        },
        onInsertImage (command, image) {
            this.$data.state.fileSelect = false
            command({ src: image.src })
        },
        onInsertLink (command) {
            command(this.$data.link)
        },
        insertBlock () {
            this.$data.editor.commands.styledBlock()
        },
        insertIframe (data) {
            this.$data.editor.commands.iframe(data)
        },
        insertImage (media) {
            this.$data.editor.commands.image({
                src: media.sizes.m.src,
                alt: media.alt,
                title: media.title
            })
        },
        insertGallery (medias) {
            this.$data.editor.commands.gallery({ medias })
        }
    }
}
</script>