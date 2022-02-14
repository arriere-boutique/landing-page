<template>
    <div class="Wrapper Wrapper--left Wrapper--s pv-40">
        <h1 class="Title--l ft-bold">Participer à l'accès anticipé de l'Arrière Boutique</h1>
        
        <div class="glow p-30 br-m is-precious mt-30">
            <div>
                <p class="ft-xl-bold"><i class="fal fa-stars"></i> Soutiens le projet et obtiens des récompenses</p>

                <p class="ft-m-bold mt-20">Pour tous les donateurs & donatrices d'au moins 10€ :</p>
                <ul class="checklist mt-10">
                    <li>Toutes les fonctionnalités pendant 2 mois</li>
                    <li>Accès anticipé aux nouveautés</li>
                    <li>Donne ton avis et propose tes idées</li>
                </ul>
            </div>
        </div>

        <div class="mt-60">
            <p class="Title--s mb-10">Donne + et <b>obtiens des récompenses !</b></p>

            <div class="Gift d-flex" :class="[ `is-${extra.color}`, { 'is-active': i <= selected, 'is-hovered': hovered && i <= hovered }]" v-for="(extra, i) in extras" @mouseenter="hovered = i" @mouseleave="hovered = null" :key="i">
                <div class="Gift_jauge">
                    <p class="Tag mv-10">
                        <i class="fal fa-check" v-if="i <= selected"></i>
                        <span v-else>+{{ (extra.amount - currentExtra.amount) }}€</span>
                    </p>
                </div>
                <div class="Gift_content row-s fx-grow pv-20">
                    <div class="col-8 col-12@s">
                        <p class="ft-m-bold mb-15 d-none d-block@s">
                            Contribution de {{ extra.amount }}€ et plus :
                        </p>

                        <div class="b p-10 br-s fx-center">
                            <div class="Extra_tag fx-no-shrink">
                                <span class="Tag">{{ extra.duration }} mois</span>
                            </div>
                            <div class="fx-grow">
                                <p class="ft-s-medium">
                                    Toutes les fonctionnalités de ton Arrière Boutique pendant {{ extra.duration }} mois
                                </p>
                                <div class="ft-s ft-italic">
                                    Valeur : {{ (extra.duration * monthlyPrice)|round }}€*
                                </div>
                            </div>
                        </div>

                        <component :is="gift.href ? 'a' : 'div'" :href="gift.href" target="_blank" class="p-10 b br-s fx-center mt-10" v-for="(gift, i) in extra.extras" :key="i">
                            <div class="Extra_image" :style="{ backgroundImage: `url(${gift.image})` }"></div>
                            <div class="fx-grow">
                                <p class="ft-m-medium">{{ gift.text }}</p>
                                
                                {{ gift.description }}

                                <div class="mt-5">
                                    <p class="Tag Tag--s">Valeur : {{ gift.value|round }}€</p>
                                </div>
                            </div>
                        </component>

                        <div class="ft-s-medium bg-current-xweak color-current-strong p-10 br-s mt-10 fx-center d-none@s" v-if="i == selected">
                            Valeur totale : {{ extrasTotalAmount(i)|round }}€
                        </div>

                        <div class="ft-s-medium bg-current-xweak color-current-strong p-10 br-s mt-10 fx-center d-none@s" v-if="i > selected">
                            Valeur : +{{ (extrasTotalAmount(i) - totalExtrasAmount)|round }}€
                        </div>
                    </div>
                    <div class="col-4 col-12@s">
                        <div class="text-center p-10 d-flex fx-align-center fx-dir-column fx-justify-between br-s height-100 mt-10@s height-auto@s" :class="i <= selected ? ['bg-current-xweak'] : ['b']">
                            <div class="mv-10"></div>

                            <div @click="selected = i" v-if="i > selected">
                                <button-base :modifiers="['current']">
                                    Débloquer 
                                </button-base>

                                <p class="ft-s-medium color-current-strong mt-10">Pour seulement {{ extra.amount - currentExtra.amount }}€ de plus</p>
                            </div>
                            
                            <div v-else-if="i >= selected">
                                <p class="Tag"><i class="fal fa-check mr-3"></i> Sélectionné : {{ extra.amount }}€</p>
                            </div>

                            <div v-else>
                                <link-base tag="button" :modifiers="['current']"  @click="selected = i">Rétrograder</link-base>
                            </div>

                            
                            <div class="ft-s-medium mv-10">
                                <template v-if="extra.available <= 10">Plus que </template>{{ extra.available }} disponibles
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-40 ft-s ft-italic">
                * Prix d'un abonnement basique à l'Arrière Boutique prévu lors de la sortie : {{ monthlyPrice }}€ / mois. Susceptible de changer.
            </div>
        </div>

        <action-fixed :is-active="true">
            <template slot="actions">
                <div class="fx-no-shrink">
                    <p class="Tag is-precious ml-0 mr-10 d-none@s" v-if="selected > 0">
                        <i class="fal fa-truck mr-5"></i> Expédié le {{ $moment().add(2, 'days').format('DD MMM') }}
                    </p>
                </div>

                <div class="fx-center pv-10">
                    <div class="text-right mr-15">
                        <p class="ft-m-medium">
                            Je participe de {{ currentExtra.amount }}€
                        </p>

                        <p class="ft-m d-none@s">
                            {{ currentExtra.duration }} mois d'abonnement
                            <template v-if="totalExtras.length > 0"> + {{ totalExtras.map(e => e.short).join(' + ') }}</template>
                        </p>
                    </div>

                    <button-base
                        :modifiers="['precious']"
                        tag="nuxt-link"
                        :attrs="{ to: localePath({ name: 'abonnements-souscrire', query: { selected } }) }"
                    >
                        Soutenir le projet
                    </button-base>
                </div>
            </template>
        </action-fixed>
    </div>
</template>

<script>
import EXTRAS from '@/static/subscriptions.js'

export default {
    name: 'Abonnements',
    middleware: 'loggedUser',
    layout: 'dashboard',
    data: () => ({
        selected: 0,
        hovered: null,
        monthlyPrice: 8.99,
        extras: EXTRAS
    }),
    computed: {
        currentExtra () {
            return this.extras[this.selected]
        },
        totalExtras () {
            return this.extrasTotal(this.selected)
        },
        totalExtrasAmount () {
            return this.totalExtras.reduce((t, e) => t + e.value, 0) + (this.currentExtra.duration * this.monthlyPrice)
        },
        allExtras () {
            return this.extras.reduce((t, e) => {
                return [ ...t, ...e.extras]
            }, [])
        }
    },
    methods: {
        extrasTotal (selected) {
            return this.extras.reduce((t, e, index) => {
                return index <= selected ? [ ...t, ...e.extras.map(ex => ({ ...ex, isNew: index == selected })) ] : t
            }, [])
        },
        extrasTotalAmount (selected) {
            return this.extrasTotal(selected).reduce((t, e) => t + e.value, 0) + (this.extras[selected].duration * this.monthlyPrice)
        }
    }
}
</script>

<style lang="scss" scoped>
    .Extras {
        margin: 15px -3px -3px;
    }

    .Extra {
        display: inline-block;

        .ButtonBase {
            min-width: 80px;
            display: inline-block;
            text-align: center;
            margin: 3px;
        }
    }

    .Extra_image {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        background-size: cover;
        background-position: center;
        flex-shrink: 0;
        margin-right: 20px;
    }

    .Extra_tag {
        width: 80px;
        margin-right: 20px;
        text-align: center;
    }

    .Gift {

        &.is-active,
        &.is-hovered {

            .Gift_content {
                opacity: 1;
            }
        }

        &:first-child {

            .Gift_jauge {

                &::before {
                    opacity: 0;
                }
            }
        }

        &:last-child {

            .Gift_jauge {

                &::after {
                    opacity: 0;
                }
            }
        }
    }

    .Gift_content {
        opacity: 0.25;
        transition: all 250ms ease;

        &:hover {
            opacity: 1;
            transform: translateY(-2px);
        }

    }

    .Gift_jauge {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 60px;
        margin-right: 20px;

        .Tag {
            min-width: 60px;
        }

        &::before,
        &::after {
            content: "";
            width: 1px;
            flex-grow: 1;
            background: var(--color-border);
        }
    }

    @include breakpoint-s {

        .Gift {
            margin-top: 20px;
        }

        .Gift_jauge {
            display: none;
        }

        .Gift_content {
            opacity: 1;
            margin: 0;
            padding: 20px 10px;
            border: 1px solid var(--color-border);
            border-radius: 5px;
        }
    }
</style>