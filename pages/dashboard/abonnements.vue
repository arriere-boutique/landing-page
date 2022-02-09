<template>
    <div class="Wrapper Wrapper--left pv-40">
        <div class="max-width-l">
            <h1 class="ft-3xl-bold max-width-l">Participer à l'accès anticipé de l'Arrière Boutique</h1>
            
            <div class="glow p-30 br-m is-precious mt-30">
                <div>
                    <p class="ft-2xl-bold"><i class="fal fa-stars"></i> Soutiens le projet et obtiens des récompenses</p>
                    <!-- <span class="Tag Tag--s mt-10">Offre limitée aux 100 premiers</span> -->

                    <p class="ft-m-bold mt-20">Pour tous les donateurs & donatrices d'au moins 10€ :</p>
                    <ul class="checklist mt-10 ml-10">
                        <li>Toutes les fonctionnalités pendant 2 mois</li>
                        <li>Accès anticipé aux nouveautés</li>
                        <li>Donne ton avis et propose tes idées</li>
                    </ul>
                </div>
            </div>

            <div class="mt-30">
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
                            <div class="b p-10 br-s fx-center">
                                <span class="Tag mr-10 fx-no-shrink">{{ extra.duration }} mois</span>
                                <div class="fx-grow">
                                    <p class="ft-s-medium">
                                        Toutes les fonctionnalités de ton Arrière Boutique pendant {{ extra.duration }} mois
                                    </p>
                                    <div class="ft-s ft-italic">
                                        Valeur : {{ (extra.duration * monthlyPrice)|round }}€*
                                    </div>
                                </div>
                            </div>

                            <div class="p-10 b br-s fx-center mt-10" v-for="(gift, i) in extra.extras" :key="i">
                                <div class="Extra_image" :style="{ backgroundImage: `url(${gift.image})` }"></div>
                                <div>
                                    <p class="ft-m-medium">{{ gift.text }}</p>
                                    {{ gift.description }}
                                    <p class="ft-s ft-italic">Valeur : {{ gift.value|round }}€</p>
                                </div>
                            </div>

                            <div class="ft-s-medium bg-current-xweak color-current-strong p-10 br-s mt-10 fx-center" v-if="i == selected">
                                Valeur totale : {{ extrasTotalAmount(i)|round }}€
                            </div>

                            <div class="ft-s-medium bg-current-xweak color-current-strong p-10 br-s mt-10 fx-center" v-if="i > selected">
                                Valeur : +{{ (extrasTotalAmount(i) - totalExtrasAmount)|round }}€
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="text-center p-10 d-flex fx-align-center fx-justify-center br-s height-100" :class="i <= selected ? ['bg-current-xweak'] : ['b']">
                                <div @click="selected = i" v-if="i > selected">
                                    <button-base :modifiers="['current']">
                                        Débloquer 
                                    </button-base>

                                    <p class="ft-s-medium color-current-strong mt-10">Pour seulement {{ extra.amount - currentExtra.amount }}€ de plus</p>
                                </div>
                                
                                <div v-else-if="i >= selected">
                                    <p class="Tag">Mon don : {{ extra.amount }}€</p>
                                </div>

                                <div v-else>
                                    <link-base tag="button" :modifiers="['current']"  @click="selected = i">Rétrograder</link-base>
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
                    <div></div>

                    <div class="fx-center text-right pv-10">
                        <div>
                            <p class="ft-m-medium mr-10">
                                Je participe de {{ currentExtra.amount }}€
                            </p>

                            <p class="ft-m mr-10">
                                {{ currentExtra.duration }} mois d'abonnement
                                <template v-if="totalExtras.length > 0"> + {{ totalExtras.map(e => e.short).join(' + ') }}</template>
                            </p>
                        </div>

                        <button-base
                            :modifiers="['precious']"
                        >
                            Soutenir le projet
                        </button-base>
                    </div>
                </template>
            </action-fixed>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Abonnements',
    middleware: 'loggedUser',
    layout: 'dashboard',
    data: () => ({
        selected: 1,
        hovered: null,
        monthlyPrice: 8.99,
        extras: [
            { amount: 10, duration: 2, extras: [], color: 'emerald' },
            { amount: 20, duration: 3, color: 'pond', extras: [
                {
                    id: 1,
                    value: 11.99,
                    image: 'https://i.etsystatic.com/31300252/r/il/0d5b85/3550914061/il_1588xN.3550914061_hs3x.jpg',
                    text: `24 stickers assortis pour tes commandes`,
                    short: '24 stickers assortis'
                },
                {
                    id: 2,
                    value: 14.99,
                    image: 'https://i.etsystatic.com/31300252/r/il/8bfde2/3567493198/il_1588xN.3567493198_nwiv.jpg',
                    text: `1 calendrier des entrepreneurs & entrepreneuses 2022`,
                    short: '1 calendrier'
                }
            ] },
            { amount: 45, duration: 6, color: 'ice', extras: [
                {
                    id: 4,
                    value: 32.99,
                    image: 'https://i.etsystatic.com/31300252/r/il/4157d4/3503142634/il_794xN.3503142634_cp8w.jpg',
                    text: `72 stickers personnalisés avec ton logo`,
                    short: '72 stickers logo'
                },
                {
                    id: 3,
                    value: 21.99,
                    image: 'https://i.etsystatic.com/31300252/r/il/74b0d3/3576593512/il_1588xN.3576593512_lkm6.jpg',
                    text: `2 calepins to-do list de l'Arrière Boutique`,
                    short: '2 calepin to-do'
                },
            ] },
            { amount: 75, duration: 6, color: 'precious', extras: [
                {
                    id: 5,
                    value: 59.90,
                    image: '',
                    text: `45 minutes de coaching par téléphone`,
                    short: '45 min. de coaching'
                }
            ] },
        ]
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
</style>