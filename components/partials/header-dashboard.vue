<template>
    <header class="HeaderDashboard bg-pond-xweak">
        <div class="HeaderDashboard_wrapper">
            <div class="HeaderDashboard_links">
                <link-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'blog' }) }" class="HeaderDashboard_link mr-20">Le blog</link-base>

                <link-base tag="nuxt-link" :attrs="{ to: localePath({ name: 'blog' }) }" class="HeaderDashboard_link">Un problème ?</link-base>
            </div>

            <div class="HeaderDashboard_right">
                <div class="HeaderDashboard_profile"></div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    class: 'HeaderDashboard'
}
</script>