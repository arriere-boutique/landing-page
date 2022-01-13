<template>
    <div class="LandingPage_content" :class="{ 'is-loaded': !isLoading }" :style="custom">

        <div class="LandingPage_backgroundColor"></div>

        <div class="LandingPage_container" v-if="content">
            <div class="LandingPage_logo" v-if="content.logo" :style="{ backgroundImage: `url(${content.logo})` }"></div>

            <h1 class="LandingPage_title">{{ content.title }}</h1>
            <h2 class="LandingPage_text" v-if="content.description">{{ content.description }}</h2>

            <div class="LandingPage_buttons">
                <button-base class="LandingPage_button" :modifiers="['full']" v-for="(link, i) in content.links" tag="a" :link="link.href" :key="i">
                    {{ link.label }}
                </button-base>
            </div>
        </div>

        <div class="LandingPage_footer">
            <a class="LandingPage_footerLogo fill-bg-light" :href="$baseUrl">
                <icon-base name="logo/logo-main" />
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LandingContent',
    props: {
        content: { type: [Object, Boolean], default: false }
    },
    data: () => ({
        isLoading: true
    }),
    async mounted () {
        if (this.content.customization['background']) {
            await new Promise((resolve, reject) => {
                let img = new Image()
                img.onload = () => resolve(img.height)
                img.onerror = reject
                img.src = this.content.customization['background']
            })

            this.isLoading = false
        }

        setTimeout(() => this.isLoading = false, 5000)
    },
    computed: {
        custom () {
            return Object.keys(this.content.customization).reduce((total, current) =>  {
                let value = this.content.customization[current]

                if (!['background', 'background-opacity', 'background-thumbnail'].includes(current)) return total

                if (current == 'background' || current == 'background-thumbnail') value = `url(${value})`
                if (current == 'background-opacity') value = value / 100

                return { ...total, [`--${current}`]: value }
            }, {})
        }
    }
}
</script>

<style lang="scss" scoped>
    .LandingPage_content {
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
        background-color: black;
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

    .LandingPage_title {
        font: var(--ft-l-bold);
    }

    .LandingPage_buttons {
        margin-top: 20px;
    }

    .LandingPage_button {
        margin: 10px auto;
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
        margin: 5vh auto;
        z-index: 5;
        width: 100%;
        text-align: center;
    }

    .LandingPage_footerLogo {
        min-width: 75px;
        max-width: 120px;
        width: 20%;
        display: block;
        margin: 0 auto;

        .IconBase {
            width: 100%;
        }
    }
</style>