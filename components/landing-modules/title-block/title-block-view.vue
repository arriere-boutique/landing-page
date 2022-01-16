<template>
    <div>
        <h1 class="LandingPage_title" v-if="title">{{ title }}</h1>
        <h2 class="LandingPage_text" v-if="paragraph">{{ paragraph }}</h2>
    </div>
</template>

<script>
export default {
    name: 'TitleBlockView',
    props: {
        title: { type: String },
        paragraph: { type: String }
    }
}
</script>

<style lang="scss" scoped>
    .LandingPage_title {
        font: var(--ft-l-bold);
    }
</style>