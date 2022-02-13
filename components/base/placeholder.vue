<template>
    <div class="Placeholder" :class="[ $modifiers ]">
        <div>
            <div class="d-flex color-ft-weak fx-justify-between ft-xl">
                <div @animationiteration="() => switchIcon(0)">
                    <i class="fal" :class="[ `fa-${icons[0]}` ]"></i>
                </div>
                <div @animationiteration="() => switchIcon(1)">
                    <i class="fal" :class="[ `fa-${icons[1]}` ]"></i>
                </div>
                <div @animationiteration="() => switchIcon(2)">
                    <i class="fal" :class="[ `fa-${icons[2]}` ]" ></i>
                </div>
            </div>

            <p class="color-ft-weak ft-m-medium" v-if="text">{{ text }}</p>

            <slot></slot>
        </div>
    </div>
</template>

<script>
import { randomIcon } from '@/utils/base'
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'Placeholder',
    mixins: [ ModifiersMixin ],
    props: {
        text: { type: String, default: '' }
    },
    data: () => ({
        icons: {}
    }),
    mounted () {
        this.icons = { 0: randomIcon('craft'), 1: randomIcon('craft'), 2: randomIcon('craft') }
    },
    methods: {
        switchIcon (i) {
            this.icons = { ...this.icons, [i]: randomIcon('craft', Object.values(this.icons)) }
        }
    }
}
</script>

<style lang="scss" scoped>
    .Placeholder {
        background-color: var(--color-bg-xweak);
        height: 100%;
        position: relative; 
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;

        & > div {
            position: relative;
            z-index: 5;
            text-align: center;
            width: 80%;

            & > div {
                width: 85px;
                margin: 0 auto;

                & > div {
                    width: 20px;
                    text-align: center;
                    animation: animate 3000ms linear 0ms infinite;

                    &:nth-child(2) {
                        animation-delay: 200ms;
                    }

                    &:nth-child(3) {
                        animation-delay: 400ms;
                    }
                }
            }
        }

        @keyframes animate {
            0% {
                transform: translateY(-20px) scale(0);
                opacity: 1;
            }

            5% {
                transform: translateY(-3px);
            }

            8% {
                transform: translateY(1px);
            }

            14% {
                transform: translateY(-2px);
            }

            18% {
                transform: translateY(0px);
            }

            26% {
                transform: translateY(-1px);
            }

            30% {
                transform: translateY(0);
            }

            60% {
                transform: translateY(0);
                opacity: 1;
            }

            70% {
                transform: translateY(-10px) scale(0.5) rotate(10deg);
                opacity: 0;
            }

            100% {
                transform: translateY(-20px) scale(0);
                opacity: 0;
            }
        }
        &::before {
            content: "";
            display: block;
            padding-bottom: 100%;
        }

        &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, var(--color-bg-weak-0) 0%, var(--color-bg-weak-50) 50%, var(--color-bg-weak-0) 100%);
            animation: placeholder 1000ms cubic-bezier(0.4, 0, 1, 1) 0ms infinite;
        }
    }

    @keyframes placeholder {
        0% {
            transform: translateX(-100%) scaleX(50%);
            opacity: 0;
        }

        50% {
            opacity: 0.25;
        }

        100% {
            opacity: 0;
            transform: translateX(200%) scaleX(100%);
        }
    }

    .Placeholder--h {
        height: auto;

        &::before {
            padding-bottom: 50%;
        }

        &.Placeholder--s::before {
            padding-bottom: 25%;
        }

        &.Placeholder--xs::before {
            padding-bottom: 15%;
        }
    }

    .Placeholder--simple {
        
        & > div {
            display: none;
        }
    }
</style>