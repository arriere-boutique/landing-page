<template>
    <div class="AuthorBlock is-duck">
        <div class="AuthorBlock_image" :style="{ backgroundImage: `url(${assets.profile})` }"></div>
        <div class="AuthorBlock_content">
            <p class="ft-l-bold">
                Théotime Colin <span class="label n-mt-5 ml-5">L'auteur</span>
            </p>

            <p class="mt-5 ellipsis-3">Ma passion ? T'aider à te consacrer pleinement à la tienne : la création.</p>

            <button-base class="mt-10" :modifiers="['link']" icon-before="hand-wave" tag="nuxt-link" :attrs="{ to: localePath({ name: 'moi-moi-moi' }) }">À propos de moi</button-base>
        </div>
    </div>
</template>

<script>
import profile from '@/assets/img/about/portrait_1.jpg'

export default {
    name: 'AuthorBlock',
    data: () => ({
        assets: { profile }
    })
}
</script>