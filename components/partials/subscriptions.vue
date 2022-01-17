<template>
    <div class="Subs">
        <div class="Subs_body">
            <div class="Subs_header">
                <div class="Subs_table  fx-no-shrink">
                    <div class="Subs_col" :class="[ `Subs_col--${tier.id}`, `is-${tier.color}` ]" v-for="(tier, i) in tiers" :key="tier.id">
                        <div class="ft-2xl color-current-strong">
                            <i class="fal" :class="[`fa-${tier.icon}`, { 'color-ft-light': !tier.icon }]"></i>
                        </div>

                        <p class="Subs_title ft-2xl-bold color-current-xstrong">{{ tier.name }}</p>

                        <p class="mt-10 ft-s-medium color-current-xstrong" v-if="tiers[i - 1]">
                            Tout ce qui est inclus dans l'abonnement {{ tiers[i - 1].name }}, avec en plus :
                        </p>
                        <p class="mt-10 ft-xs-medium color-ft-weak" v-else>
                            Gratuit, pour toujours.
                        </p>
                    </div>
                </div>
            </div>

            <div class="Subs_scroll">
                <div class="Subs_table fx-grow"  v-for="category, i in ['pages', 'orders', 'fun', 'tools']" :key="i">
                    <div class="Subs_col" :class="[ `Subs_col--${tier.id}`, `is-${tier.color}` ]" v-for="tier in tiers" :key="tier.id">
                        <div class="mv-10">
                            <p class="ft-s-bold mb-5">{{ $t(`tiers.categories.${category}.label`) }}</p>
                            <div v-for="feature, j in tier.features[category]" :key="j" :class="{ 'color-current-strong ft-m-medium' : feature.highlight }">
                                <i class="fal fa-sm mr-5" :class="[ feature.no ? 'fa-times' : (feature.dev ? 'fa-spinner-third' : 'fa-check'), { 'spin': feature.dev } ]"></i> <span :class="[feature.tooltip ? 'text-dashed' : '']">{{ feature.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="Subs_footer">
                <div class="Subs_table fx-no-shrink">
                    <div class="Subs_col" :class="[ `Subs_col--${tier.id}`, `is-${tier.color}` ]" v-for="tier in tiers" :key="tier.id">
                        <template v-if="tier.id != 'free'">
                            <div class="d-flex fx-align-center">
                                <div class="fx-grow">
                                    <p class="ft-xl-bold text-through">
                                        {{ tier.prices.base }}<span class="ft-s-medium">€ / mois</span>
                                    </p>
                                </div>
                            </div>
                            
                            <hr class="Separator bg-current-weak mv-20">

                            <div class="d-flex fx-align-center">
                                <div class="fx-grow">
                                    <p class="ft-2xl-bold">
                                        {{ tier.prices.early }}<span class="ft-s-medium">€ / mois</span>
                                    </p>
                                    <p class="Tag Tag--s n-ml-5" :class="[ `is-${tier.color}` ]">Tarif early-bird</p>
                                </div>
                                
                                <div>
                                    <button-base :modifiers="[ tier.color ]">
                                        Je m'abonne
                                    </button-base>
                                </div>
                            </div>

                            <div class="Gauge mt-20">
                                <div>
                                    <span>99 restants</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TIERS from '@/static/tiers.js'

export default {
    name: 'Subscriptions',
    data: () => ({
        tiers: TIERS
    }),
}
</script>

<style lang="scss" scoped>

    .Gauge {
        background: var(--color-white);
        height: 25px;
        font: var(--ft-xs-medium);
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 15px;

        span {
            position: relative;
            z-index: 3;
        }

        &::before {
            content: "";
            display: block;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            position: absolute;
            transform-origin: left;
            transform: scaleX(0.8);
            background: var(--color-current);
        }
    }

    .Subs {
    }

    .Subs_body {
        display: flex;
        flex-direction: column;
    }

    .Subs_header {
        flex-shrink: 0;
        position: sticky;
        top: 0px;
        background: var(--color-bg-light);
        border-bottom: 1px solid var(--color-border);
        padding-top: 20px;
    }

    .Subs_footer {
        flex-shrink: 0;
        position: sticky;
        bottom: 0px;
        padding-bottom: 20px;
        border-top: 1px solid var(--color-border);
        background: var(--color-bg-light);
    }

    .Subs_table {
        display: flex;
    }

    .Subs_col {
        flex: 1;
        // border: 1px solid var(--color-border);
        padding: 15px 25px;
    }

    .Subs_col--free {
        flex: 0 0 25%;
    }
    
    .Subs_col--basic {
        background-color: var(--color-pond-xweak);
    }

    .Subs_col--creation {
        background-color: var(--color-precious-xweak);
    }
</style>