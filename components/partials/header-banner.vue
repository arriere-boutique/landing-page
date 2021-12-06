<template>
    <div class="HeaderBanner d-none@xs">
        <div class="Wrapper ft-l d-flex fx-align-center">
            <p class="fx-grow">
                <b>#CaféDimanche :</b> 30 min. d'appel avec moi pour parler de ta boutique à seulement 16,90€.
            </p>
            
            <link-base tag="nuxt-link" href="" :attrs="{ to: localePath({ name: 'shop-cafe-dimanche' }) }">
                Je m'inscris
            </link-base>
        </div>
    </div>
</template>


<script>
export default {
    name: 'HeaderBanner'
}
</script>