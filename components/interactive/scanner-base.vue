<template>
    <div class="Scanner">
        <div class="Scanner_container">
            <video ref="video" v-show="!isLoading"></video>

            <button-base @click="initReader" v-if="!isInit">
                Activer caméra
            </button-base>

            <i class="fal fa-spinner-third spin" v-else-if="isLoading"></i>
            <div class="Scanner_overlay" v-else></div>
        </div>

        <div class="Scanner_actions" v-if="devices.length > 0 && isInit">
            <select-base
                class="Scanner_select"
                v-model="selectedDevice"
                :options="devices.map(d => ({
                    id: d.deviceId,
                    label: d.label,
                    value: d.deviceId
                }))"
            />

            <button-base class="Scanner_switch" :modifiers="['round', 'light']" @click="nextDevice">
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
        result: null,
        selectedDevice: null,
        devices: [],
        codeReader: null,
        codeControls: null
    }),
    watch: {
        selectedDevice (v) {
            if (v !== null && this.isInit) this.initReader()
        },
        result (v) {
            this.$emit('input', v)
        }
    },
    beforeDestroy () {
        if (this.codeReader) this.codeReader.reset()
    },
    async mounted () {
        this.codeReader = new BrowserMultiFormatReader()

        try {
            this.devices = await this.codeReader.listVideoInputDevices()
            this.selectedDevice = this.devices[0].deviceId
        } catch (e) {
            console.error(e)
        }
    },
    methods: {
        nextDevice () {
            let currentIndex = this.devices.indexOf(this.devices.find(d => d.deviceId == this.selectedDevice))

            this.selectedDevice = this.devices[currentIndex + 1] ? this.devices[currentIndex + 1].deviceId : this.devices[0].deviceId
        },
        async initReader () {
            this.isInit = true 
            
            this.codeControls = await this.codeReader.decodeFromVideoDevice(this.selectedDevice, this.$refs.video, (result, err) => {
                if (result) this.result = result.text
            })

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
    }

    .Scanner_switch {
        display: none;
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

        .Scanner_switch {
            display: inline-flex;
        }

        .Scanner_select {
            display: none;
        }
    }
</style>