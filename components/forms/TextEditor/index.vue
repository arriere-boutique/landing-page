<template>
    <div class="TextEditor">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, getMarkAttrs, getNodeAttrs }" v-if="editable">
            <div>
                <div class="TextEditor_menu">
                    <div class="TextEditor_first">
                        <div class="TextEditor_group" v-for="(group, i) in groups" :key="i">
                            <component
                                v-for="command in group"
                                :is="command.component || 'button-editor'"
                                :is-active="isActive[command.id] ? isActive[command.id]() : false"
                                :icon="command.icon"
                                :current-node="command.isNode ? getNodeAttrs(command.value) : (command.isMark ? getMarkAttrs(command.value) : null)"
                                @click="command.setCurrent ? state.current = command.id : editor.commands[command.id]()"
                                @update="(v) => command.onUpdate(v) || undefined"
                                :key="command.id"
                            />

                            <div class="TextEditor_separator"></div>
                        </div>
                    </div>
                </div>

                <popin-link
                    :is-active="state.current == 'linkSelect'"
                    @input="commands.link"
                    @close="state.current = ''"
                />

                <!-- <div class="TextEditor_second" :class="{ 'is-active': state.current == 'linkSelect' }">
                    <input type="text" placeholder="Lien" v-model="link.href">
                    <label class="fx-no-shrink">
                        <input type="checkbox" v-model="link.blank">Nouvel onglet
                    </label>
                    <button type="button" class="Button" @click="onInsertLink(commands.link)">Insérer</button>
                </div>

                <div class="TextEditor_second" :class="{ 'is-active': state.current == 'blockSelect' }">
                    <select v-model="block">
                        <option value="StyledBlock--pink">Pink</option>
                        <option value="StyledBlock--cyan">Cyan</option>
                        <option value="StyledBlock--blue">Blue</option>
                        <option value="StyledBlock--gold">Gold</option>
                    </select>
                    <button type="button" class="Button" @click="commands.styledBlock({ block: block })">
                        Insérer
                    </button>
                </div>

                <div class="TextEditor_second" :class="{ 'is-active': state.current == 'styleSelect' }">
                    <div class="TextEditor_group">
                        <button
                            v-for="(command, i) in style"
                            class="TextEditor_button"
                            :class="{ 'is-active': isActive[command.id] ? isActive[command.id]() : false }"
                            type="button"
                            @click="command.onClick ? command.onClick() : commands[command.id]()"
                            :key="i"
                        >
                            <i class="fal" :class="{ ['fa-' + command.fa]: true }"></i>
                        </button>
                    </div>
                </div> -->
            </div>
        </editor-menu-bar>

        <div class="TextBody" v-html="value" v-if="!editor"></div>
        <editor-content class="TextEditor_content TextBody" :editor="editor" ref="text" v-if="editor" />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { Heading, Bold, Blockquote, Image, History, Italic, OrderedList, BulletList, ListItem } from 'tiptap-extensions'
import Link from '@/plugins/tiptap/Link'
import StyledBlock from '@/plugins/tiptap/StyledBlock'
import ButtonEditor from './components/button-editor'
import ButtonHeadings from './components/button-headings'

export default {
    name: 'TextEditor',
    components: { EditorContent, EditorMenuBar, StyledBlock, ButtonEditor, ButtonHeadings },
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
                new Link(), new StyledBlock()
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
                { id: 'fileSelect', label: 'Image', icon: 'image' },
                { id: 'linkSelect', icon: 'link', setCurrent: true },
                { id: 'blockquote', label: 'Citation', icon: 'quote-right' },
                { id: 'bullet_list', label: 'Liste', icon: 'list-ul' },
                { id: 'ordered_list', label: 'Liste numérotée', icon: 'list-ol' },
            ], [
                { id: 'blockSelect', label: 'Bloc', icon: 'lightbulb-on' },
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
        }
    }
}
</script>