<template>
    <div class="AuthorBlock is-amber">
        <div class="AuthorBlock_image" :style="{ backgroundImage: `url(${assets.profile})` }"></div>
        <div class="AuthorBlock_content">
            <p class="ft-m-bold">
                Théotime Colin <span class="label n-mt-3 ml-5">Créateur Etsy</span>
            </p>
            <p class="mt-10 ellipsis-3"> In hac habitasse platea dictumst. Phasellus semper ornare arcu, vitae ultricies lorem tincidunt nec. Fusce rutrum tincidunt elit non aliquam. Mauris consectetur tellus a suscipit mollis. Nullam non risus at lorem porta tempor et id lectus. Ut vitae quam ornare, viverra tellus pulvinar, tincidunt ligula. Vestibulum purus augue, mattis sed tellus id, laoreet feugiat enim</p>
        </div>
    </div>
</template>

<script>
import profile from '@/assets/img/about/profile.jpg'

export default {
    name: 'AuthorBlock',
    data: () => ({
        assets: { profile }
    })
}
</script>