<template>
    <div class="Wrapper Wrapper--left Wrapper--s pt-40 pb-100">
        <div class="glow p-30 br-m is-precious p-20@s">
            <div class="row-xs">
                <div class="col-12 mv-5">
                    <div class="fx-center p-15 bg-bg-light br-s color-ft d-block@s">
                        <div class="Extra_tag">
                            <span class="Tag">{{ currentExtra.duration }} mois</span>
                        </div>
                        <div class="fx-grow">
                            <p class="ft-m-medium ellipsis-2 ft-s-medium@s">Toutes les fonctionnalités de ton Arrière Boutique pendant {{ currentExtra.duration }} mois</p>
                                        
                            <ul class="checklist mt-5 ft-s-medium@s">
                                <li>Accès anticipé aux nouveautés</li>
                                <li>Donne ton avis et propose tes idées</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-4 col-12@s mv-5" v-for="extra in extrasTotal" :key="extra.id">
                    <div class="fx-center p-10 bg-bg-light br-s color-ft">
                        <div class="Extra_image" :style="{ backgroundImage: `url(${extra.image})` }"></div>
                        <div class="fx-grow">
                            <p class="ft-s-medium ellipsis-2">{{ extra.text }}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-20 text-center">
                <p class="Tag">Ma contribution : {{ currentExtra.amount }}€</p>
            </div>
        </div>
        <form class="mt-20 b p-20 br-s o-hidden p-relative" @submit.prevent="onSubmit" v-if="selected != 0">
            <div class="fx-center">
                <p class="ft-l-bold fx-grow">Mes informations de livraison</p>
                <button-base type="button" v-if="step != 0" icon-before="pen" :modifiers="['secondary', 's']" @click="step = 0">Modifier</button-base>
            </div>

            <transition name="fade-h">
                <div v-show="step == 0">
                    <div class="d-flex mt-20 mb-10 d-block@s">
                        <input-base label="Prénom" type="text" class="mr-10 mr-@s mb-10@s" :attrs="{ required: true }" v-model="form.name" />
                        <input-base label="Nom de famille" type="text" :attrs="{ required: true }" v-model="form.surname" />
                    </div>
                    
                    <input-base label="Numéro et rue" :attrs="{ required: true }" type="text" class="mb-10" v-model="form.address" />

                    <input-base label="Bâtiment, numéro d'appartement..." type="text" class="mb-10" v-model="form.address2" />

                    <div class="d-flex mb-10 d-block@s">
                        <input-base label="Code postal" type="text" :attrs="{ required: true }" class="mr-10 mr-@s mb-10@s" v-model="form.postalCode" />
                        <input-base label="Ville" type="text" :attrs="{ required: true }" v-model="form.city" />
                    </div>

                    <div class="SelectBase is-value mb-10">
                        <label class="InputBase_label">Pays</label>

                        <select
                            v-model="form.country"
                            class="SelectBase_value"
                        >
                            <option value="france">
                                France
                            </option>
                        </select>
                    </div>

                    <div class="text-right mt-20">
                        <button-base type="submit" :class="{ 'is-loading': isLoading }" icon-after="long-arrow-right">Continuer</button-base>
                    </div>
                </div>
            </transition>
        </form>

        <form class="mt-20 b p-20 br-s" @submit.prevent="onCheckout" v-show="step == 1">
            <div class="fx-center mb-20">
                <p class="ft-l-bold fx-grow">Paiement</p>
            </div>

            <div id="card-element">
                <div class="p-20 text-center bg-ice-xweak br-s">
                    <i class="fal fa-spinner-third spin"></i>
                </div>
            </div>

            <!-- <div class="Tag">
                Valeur totale {{ totalExtrasAmount }}€
            </div> -->

            <div class="fx-center text-right mt-20">
                <div class="fx-grow mr-20">
                    <p class="ft-2xl-bold line-1">{{ currentExtra.amount }}€</p>
                    <p class="ft-s ft-italic color-ft-weak">Paiement unique.</p>
                </div>

                <button-base type="submit" :class="{ 'is-loading': isLoading }" icon-after="long-arrow-right">Continuer</button-base>
            </div>
        </form>
    </div>
</template>

<script>
import EXTRAS from '@/static/subscriptions.js'
import { InputBase } from 'instant-coffee-core'

export default {
    name: 'InformationsPage',
    layout: 'dashboard',
    components: { InputBase },
    data: () => ({
        errors: [],
        extras: EXTRAS,
        selected: 0,
        isLoading: false,
        elements: null,
        monthlyPrice: 8.99,
        step: 0,
        form: {
            name: '',
            surname: '',
            address: '',
            address2: '',
            postalCode: '',
            city: '',
            country: 'france'
        }
    }),
    computed: {  
        user () { return this.$store.state.auth.user },
        currentExtra () {
            return this.extras[this.selected]
        },
        extrasTotal () {
            return this.extras.reduce((t, e, index) => {
                return index <= this.selected ? [ ...t, ...e.extras.map(ex => ({ ...ex, isNew: index == this.selected })) ] : t
            }, [])
        },
        totalExtrasAmount () {
            return this.extrasTotal.reduce((t, e) => t + e.value, 0) + (this.currentExtra.duration * this.monthlyPrice)
        },
    },
    watch: {
        user: {
            immediate: true,
            handler (v) {
                if (v) {
                    this.form = {
                        ...this.form,
                        name: v.name,
                        surname: v.surname,
                        email: v.email,
                        address: v.address,
                        address2: v.address2,
                        postalCode: v.postalCode,
                        city: v.city,
                        country: v.country
                    }
                }
            }
        } 
    },
    created () {
        this.selected = this.$route.query.selected ? this.$route.query.selected : 0
        if (this.selected == 0) this.step = 1
    },
    mounted () {
        this.initForm()
    },
    methods: {
        async onSubmit () {
            this.isLoading = true

            const token = await this.$recaptcha.execute('login')

            this.errors = []

            try {
                const response = await this.$store.dispatch('user/update', { 
                    _id: this.user._id,
                    params: { ...this.form, password: undefined, token }
                })

                if (response.status != 1) throw response.errors

                this.step = 1
            } catch (e) {
                console.error(e)
                this.errors = e
            }

            this.isLoading = false
        },
        async initForm () {
            try {
                let response = await this.$store.dispatch('order/checkout', {
                    price: this.currentExtra.amount * 100,
                    type: 'subscription',
                    metadata: {
                        id: this.selected
                    }
                })

                if (this.$stripe) {
                    this.elements = this.$stripe.elements({ clientSecret: response.token, locale: 'fr' })
                    const card = this.elements.create('payment')
                    card.mount('#card-element')
                }
            } catch (e) {
                console.error(e)
            }
        },
        async onCheckout () {
            this.isLoading = true

            try {
                const response = await this.$stripe.confirmPayment({
                    elements: this.elements,
                    confirmParams: {
                        return_url: this.$config.dashboardUrl + this.localePath({ name: 'abonnements-confirmation' })
                    }
                })
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>

    .Extra_image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        background-size: cover;
        background-position: center;
        flex-shrink: 0;
        margin-right: 10px;
    }

    .Extra_tag {
        width: 100px;
        margin-right: 10px;
        flex-shrink: 0;
        text-align: center;
    }

    @include breakpoint-s {
        
        .Extra_tag {
            width: auto;
            margin-bottom: 10px;
            text-align: left;
        }
    }
</style>