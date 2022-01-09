<template>
    <div class="Placeholder">
        <div>
            <div class="d-flex color-ft-weak fx-justify-between ft-xl">
                <div>
                    <i class="fal" :class="[ `fa-${icons[0]}` ]"></i>
                </div>
                <div>
                    <i class="fal" :class="[ `fa-${icons[1]}` ]"></i>
                </div>
                <div>
                    <i class="fal" :class="[ `fa-${icons[2]}` ]"></i>
                </div>
            </div>
            <p class="color-ft-weak ft-m-medium" v-if="text">{{ text }}</p>
        </div>
    </div>
</template>

<script>
import { randomIcon } from '@/utils/base'

export default {
    name: 'Placeholder',
    props: {
        text: { type: String, default: '' }
    },
    data: () => ({
        icons: []
    }),
    mounted () {
        this.icons = [ randomIcon(), randomIcon(), randomIcon() ]
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

        & > div {
            position: relative;
            z-index: 5;
            text-align: center;
            width: 80%;

            & > div {
                width: 85px;
                margin: 0 auto;

                & > div {
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
                transform: translateY(0);
            }

            10% {
                transform: translateY(-10px) scale(0.5) rotate(10deg);
                opacity: 0;
            }

            30% {
                transform: translateY(-20px) scale(0);
                opacity: 0;
            }

            31% {
                opacity: 1;
            }
            
            33% {
                transform: translateY(2px);
            }

            40% {
                transform: translateY(-4px);
            }

            44% {
                transform: translateY(0px);
            }

            46% {
                transform: translateY(-1px);
            }

            50% {
                transform: translateY(0);
            }
        
            100% {
                transform: translateY(0);
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
</style>