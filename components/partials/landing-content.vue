<template>
    <div class="LandingPage_content" :class="{ 'is-loaded': !isLoading, 'is-preview': isPreview }" :style="custom">

        <div class="LandingPage_backgroundColor"></div>

        <div class="LandingPage_container" v-if="content">
            <div class="LandingPage_logo" v-if="content.logo" :style="{ backgroundImage: `url(${content.logo})` }"></div>

            <transition-group tag="div" name="default" class="LandingPage_modules">
                <div v-for="module in orderedModules" :key="module.id">
                    <component :is="module.type + '-view'" v-bind="module" :is-preview="isPreview" class="mv-20" />
                </div>
            </transition-group>
        </div>

        <div class="LandingPage_footer" v-if="!isPreview">
            <div>
                <div class="LandingPage_credits p-10" v-if="content.customization && content.customization.background && content.customization.background.photographer">
                    <p class="round-s mr-5"><i class="fal fa-camera"></i></p>
                    <link-base
                        :modifiers="['light', 's']"
                        :link="content.customization.background.photographer.url"
                        target="_blank"
                    >
                        {{ content.customization.background.photographer.name }}
                    </link-base>
                </div>
            </div>
            <a class="LandingPage_footerLogo fill-bg-light" :href="$baseUrl" target="_blank">
                <icon-base name="logo/logo-main" />
            </a>
        </div>
    </div>
</template>

<script>
import Modules from '@/components/landing-modules'

export default {
    name: 'LandingContent',
    components: { ...Modules },
    props: {
        content: { type: [Object, Boolean], default: false },
        isPreview: { type: Boolean, default: false }
    },
    data: () => ({
        isLoading: true
    }),
    async mounted () {
        if (this.content.customization && this.content.customization['background'] && !this.isPreview) {
            try {
                await new Promise((resolve, reject) => {
                    let img = new Image()
                    img.onload = () => resolve(img.height)
                    img.onerror = reject
                    img.src = this.content.customization['background'].src
                })

                this.isLoading = false
            } catch (e) {
                this.isLoading = false
            }
        }

        setTimeout(() => this.isLoading = false, 5000)
    },
    computed: {
        custom () {
            if (!this.content.customization) return {}
            
            return Object.keys(this.content.customization).reduce((total, current) =>  {
                let value = this.content.customization[current]

                if (!['background', 'background-opacity', 'background-thumbnail', 'background-color'].includes(current)) return total

                if (current == 'background-thumbnail') value = `url(${value})`
                if (current == 'background') value = `url(${value.src})`
                if (current == 'background-opacity') value = value / 100

                return { ...total, [`--${current}`]: value }
            }, {})
        },
        orderedModules () {
            return [ ...this.content.modules ].filter(m => m.active !== false).sort((a, b) => a.position - b.position)
        }
    }
}
</script>

<style lang="scss" scoped>
    .LandingPage_content {
        min-height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        color: var(--color-ft-light);
        position: relative;
        overflow: hidden;
        background-color: var(--color-bg-xweak);

        &::before, &::after {
            content: "";
            display: block;
            position: absolute;
            top: -5%;
            left: -5%;
            width: 110%;
            height: 110%;
            background-size: cover;
            background-position: center;
            transition: all 1000ms ease-in-out;
        }

        &::before {
            z-index: 1;
            background-image: var(--background-thumbnail);
            filter: blur(5px);
        }

        &::after {
            z-index: 2;
            opacity: 0;
            background-image: var(--background);
        }
    }

    .LandingPage_backgroundColor {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--background-color, black);
        z-index: 5;
        transition: all 1000ms;
        opacity: var(--background-opacity, 0);
    }

    .LandingPage_content.is-loaded {

        &::after {
            opacity: 1;
            transform: scale(0.95);
        }
    }

    .LandingPage_container {
        width: 80%;
        max-width: 500px;
        margin: 10vh auto;
        position: relative;
        z-index: 10;
    }

    .LandingPage_logo {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        margin: 0 auto 10px;
        background-color: white;
        background-position: center;
        background-size: cover;
    }

    .LandingPage_footer {
        position: relative;
        padding: 30px;
        z-index: 5;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .LandingPage_footerLogo {
        min-width: 75px;
        max-width: 120px;
        width: 20%;
        display: block;

        .IconBase {
            width: 100%;
        }
    }

    .LandingPage_credits {
        text-align: left;
        background-color: var(--color-white-25);
        border-radius: 10px;
        opacity: 0.5;
        display: flex;
        align-items: center;
        transition: all 300ms ease;

        & > p {
            background-color: var(--color-white-50);
        }

        &:hover {
            opacity: 1;
        }
    }

    .LandingPage_content.is-preview {

        &::before {
            transition: all 100ms ease;
            filter: none;
        }

        &::after {
            display: none;
        }

        .LandingPage_backgroundColor {
            transition: none;
        }
    }
</style>