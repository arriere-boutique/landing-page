<template>
    <div class="Scanner">
        <div class="Scanner_container">
            <video ref="video" v-show="!isLoading"></video>

            <button-base @click="initReader" v-if="!isInit">
                Activer caméra
            </button-base>

            <i class="fal fa-spinner-third spin" v-else-if="isLoading"></i>
            <div class="Scanner_overlay" v-else></div>

            <div class="Scanner_result Tag Tag--s" :class="{ 'is-new': isNew }" v-if="isInit && !isLoading">
                {{ result }}
            </div>
        </div>

        <div class="Scanner_actions" v-if="devices.length > 0 && isInit">
            <select-base
                class="Scanner_select"
                v-model="selectedDevice"
                v-if="devices.length > 2 && $biggerThan('s')"
                :options="devices.map(d => ({
                    id: d.deviceId,
                    label: d.label,
                    value: d.deviceId
                }))"
            />

            <button-base :modifiers="['round', 'light']" @click="() => reset()">
                <i class="fal fa-pause"></i>
            </button-base>

            <button-base :modifiers="['round', 'light']" @click="nextDevice" v-if="devices.length == 2 || $smallerThan('s')">
                <i class="fal fa-camera-rotate"></i>
            </button-base>
        </div>
    </div>
</template>

<script>
import { BrowserMultiFormatReader } from '@zxing/library'
import { SelectBase } from 'instant-coffee-core'

export default {
    name: 'ScannerBase',
    components: { SelectBase },
    data: () => ({
        isInit: false,
        isLoading: true,
        prevResult: null,
        result: null,
        selectedDevice: null,
        devices: [],
        codeReader: null,
        codeControls: null,
        isNew: false
    }),
    watch: {
        selectedDevice (v) {
            if (v !== null && this.isInit) this.initReader()
        },
        result (v) {
            this.$emit('input', v)

            if (this.prevResult != v) {
                this.isNew = true
                this.prevResult = v

                setTimeout(() => this.isNew = false, 1500)
            }
        }
    },
    computed: {
        user () { return this.$store.state.auth.user },
    },
    beforeDestroy () {
        this.reset()
    },
    async mounted () {
        this.codeReader = new BrowserMultiFormatReader()

        try {
            let deviceIndex = 0
            this.devices = await this.codeReader.listVideoInputDevices()

            if (this.user.settings && this.user.settings.favoriteDevices) {
                deviceIndex = this.devices.reduce((max, current, i) => {
                    return this.user.settings.favoriteDevices.indexOf(current.deviceId) > max ? i : max
                }, 0)
            }
            
            this.selectedDevice = this.devices[deviceIndex].deviceId
        } catch (e) {
            console.error(e)
        }
    },
    methods: {
        reset (e) {
            if (e && !document.hidden) return

            if (this.codeReader) this.codeReader.reset()

            this.isInit = false
            this.isLoading = true
            document.removeEventListener('visibilitychange', this.reset)
        },
        nextDevice () {
            let currentIndex = this.devices.indexOf(this.devices.find(d => d.deviceId == this.selectedDevice))

            this.selectedDevice = this.devices[currentIndex + 1] ? this.devices[currentIndex + 1].deviceId : this.devices[0].deviceId

            let favoriteDevices = this.user.settings && this.user.settings.favoriteDevices ? this.user.settings.favoriteDevices.filter(d => d != this.selectedDevice) : []

            favoriteDevices.push(this.selectedDevice)

            this.$store.dispatch('user/updateSettings', {
                favoriteDevices
            })
        },
        async initReader () {
            this.isLoading = true
            this.isInit = true
            
            this.codeControls = await this.codeReader.decodeFromVideoDevice(this.selectedDevice, this.$refs.video, result => {
                if (result) this.result = result.text
            })

            document.addEventListener('visibilitychange', this.reset)

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .Scanner {
        width: 100%;
        position: relative;
    }

    .Scanner_container {
        background: var(--color-bg-xweak);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;

        &::before {
            content: "";
            padding-bottom: 100%;
            display: block;
        }
        
        video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            object-fit: cover;
        }
    }

    .Scanner_result {
        position: relative;
        z-index: 5;
        opacity: 0;
        transition: all 250ms ease-out;
        pointer-events: none;

        &.is-new {
            opacity: 1;
        }
    }

    .Scanner_overlay {
        // background-color: var(--color-onyx-25);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        border: 20px solid var(--color-onyx-50);

        &::before,
        &::after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 30%;
            background-color: var(--color-onyx-50);
        }

        &::before {
            top: 0;
        }

        &::after {
            bottom: 0;
        }
    }

    .Scanner_select {
        width: 100%;
    }

    .Scanner_actions {
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    @include breakpoint-s {
        
        .Scanner_actions {
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            text-align: right;
            padding: 5px 15px;
        }

        .Scanner_select {
            display: none;
        }
    }
</style>