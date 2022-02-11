<template>
    <div class="Scanner">
        <div class="Scanner_container">
            <video ref="video"></video>

            <div class="Scanner_overlay"></div>
        </div>

        <div class="Scanner_actions" v-if="devices.length > 0">
            <select-base
                class="Scanner_select"
                v-model="selectedDevice"
                :options="devices.map(d => ({
                    id: d.deviceId,
                    label: d.label,
                    value: d.deviceId
                }))"
            />
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
        result: null,
        selectedDevice: null,
        devices: [],
        codeReader: null,
        codeControls: null
    }),
    watch: {
        selectedDevice (v) {
            if (v !== null) this.initReader()
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
            // this.selectedDevice = this.devices[0].deviceId
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
</style>