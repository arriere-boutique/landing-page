<template>
    <div class="AdviceBlock" v-if="currentAdvice && isInit">
        <transition-group name="fade">
            <div v-for="(advice, i) in advices" :key="i" v-show="i == current">
                <p class="ft-l-bold color-current-xstrong mb-10" v-if="advice.title">{{ advice.title }}</p>

                <div v-html="advice.text" v-if="advice.text"></div>

                <youtube-video class="mb-10" :id="advice.youtube" v-if="advice.youtube" />
            </div>
        </transition-group>

        <div class="AdviceBlock_footer fx-center" v-if="advices.length > 1 || isIgnore">
            <div>
                <link-base @click="ignore" v-if="isIgnore">Ne plus afficher</link-base>
            </div>

            <div v-if="advices.length > 1">
                <i class="AdviceBlock_arrow--left fal fa-arrow-left-long" :class="{ 'is-disabled': current <= 0 }"  @click="current -= 1"></i>
                <span class="AdviceBlock_counter"><b>{{ (current + 1)|fixed }}</b> / {{ advices.length|fixed }}</span>
                <i class="AdviceBlock_arrow--right fal fa-arrow-right-long" :class="{ 'is-disabled': current >= advices.length - 1 }" @click="current += 1"></i>
            </div>
        </div>
    </div>
</template>

<script>
import Advices from '@/translations/fr.js'

export default {
    name: 'AdviceBlock',
    props: {
        type: { type: String },
        isIgnore: { type: Boolean }
    },
    data: () => ({
        isInit: false,
        current: 0
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        advices () { return Advices.advices[this.type] },
        currentAdvice () {
            return this.advices && this.advices[this.current] ? this.advices[this.current] : null
        }
    },
    mounted () {
        if (this.user.settings && this.user.settings.ignoredAdvices && this.user.settings.ignoredAdvices.includes(this.type)) return

        this.isInit = true
    },
    methods: {
        async ignore () {
            let ignoredAdvices = this.user.settings && this.user.settings.ignoredAdvices ? this.user.settings.ignoredAdvices : []

            ignoredAdvices.push(this.type)

            this.$store.dispatch('user/updateSettings', {
                ignoredAdvices
            })

            this.isInit = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .AdviceBlock {
        border-radius: 20px;
        padding: 30px;
        background-color: var(--color-current-xweak);
    }

    .AdviceBlock_footer {
        margin-top: 20px;
    }

    .AdviceBlock_counter {
        min-width: 60px;
        text-align: center;
    }

    .AdviceBlock_arrow--left,
    .AdviceBlock_arrow--right {
        padding: 5px 0;
        cursor: pointer;
        transition: all 150ms ease;

        &.is-disabled {
            opacity: 0.25;
            pointer-events: none;
        }
    }

    .AdviceBlock_arrow--left {
        padding-right: 10px;

        &:hover {
            transform: translateX(-2px);
        }
    }

    .AdviceBlock_arrow--right {
        padding-left: 10px;

        &:hover {
            transform: translateX(2px);
        }
    }
</style>