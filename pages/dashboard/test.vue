<template>
    <div class="MainContainer">
        <nuxt-link class="MainClose" :to="localePath({ name: 'commandes' })">
            <i class="fal fa-times"></i>
        </nuxt-link>
        <div class="VideoContainer">
            <video class="video" ref="video"></video>
        </div>

        <div class="content"> 
            <p>{{ result }}</p>

            <select v-model="selectedDevice">
                <option v-for="device in devices" :value="device.deviceId" :key="device.deviceId">
                    {{ device.label }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import { BrowserMultiFormatReader } from '@zxing/library'

export default {
    layout: 'dashboard',
    data: () => ({
        result: '',
        selectedDevice: null,
        devices: [],
        codeReader: null,
        codeControls: null
    }),
    watch: {
        selectedDevice (v) {
            if (v !== null) this.initReader()
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
        async initReader () {
            this.codeControls = await this.codeReader.decodeFromVideoDevice(this.selectedDevice, this.$refs.video, (result, err) => {
                if (result) this.result = result.text
            })
        }
    }
}
</script>

<style lang="scss">
    .VideoContainer {
        width: 100%;
        position: relative;
        background: var(--color-bg-xweak);

        &::before {
            content: "";
            padding-bottom: 100%;
            display: block;
        }

        .video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .MainClose {
        display: none;
    }

    @include breakpoint-s {
        .MainContainer {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            position: fixed;
            z-index: 15;
        }

        .MainClose {
            color: var(--color-ft-light);
            position: absolute;
            z-index: 5;
            font-size: 30px;
            top: 5px;
            right: 5px;
            padding: 15px;
            display: block;
        }

        .VideoContainer {
            height: 100vh;
            
            &::before {
                display: none;
            }
        }

        .content {
            padding: 20px;
            background: white;
            position: relative;
            z-index: 5;
            margin-top: -20px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
        }
    }
</style>