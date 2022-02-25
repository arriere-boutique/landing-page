<template>
    <transition-group tag="div" name="flash" class="Flashes">
        <div class="Flashes_item" :class="[ `is-${flash.type}` ]" v-for="flash in flashes" :key="flash.id">
            <div class="Flashes_icon fal" :class="[ flash.icon ]"></div>

            <div class="Flashes_content fx-grow">
                <p class="Flashes_itemTitle">{{ flash.title }}</p>
                <p class="Flashes_itemText ellipsis-1" v-if="flash.text">{{ flash.text }}</p>
            </div>

            <div class="Flashes_actions">
                <div class="Flashes_action" v-if="flash.type == 'error'">
                    <i class="fal fa-copy"></i>
                </div>
                <div class="Flashes_action" @click="$store.commit('flashes/remove', flash.id)">
                    <i class="fal fa-times"></i>
                </div>
            </div>

            <div class="Flashes_progress" :style="{ '--duration' : `${flash.duration}ms` }"></div>
        </div>
    </transition-group>
</template>

<script>
const ICONS = {
    error: 'poop',
    success: 'check'
}

export default {
    name: 'FlashesManager',
    data: () => ({
        activeFlashes: []
    }),
    computed: {
        flashes () {
            return this.$store.state.flashes.items.map(i => ({
                ...i,
                icon: `fa-${ICONS[i.type]}`
            }))
        }
    },
    watch: {
        flashes (v) {

            v.forEach(flash => {
                if (!this.activeFlashes.includes(flash.id)) {
                    this.activeFlashes.push(flash.id) 

                    setTimeout(() => {
                        this.$store.commit('flashes/remove', flash.id)
                        this.activeFlashes = this.activeFlashes.filter(f => f != flash.id)
                    }, flash.duration)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Flashes {
        position: fixed;
        top: 20px;
        right: 25px;
        z-index: 10000;
    }

    .Flashes_item {
        display: flex;
        color: var(--color-ft-light);
        margin: 5px 0;
        border-radius: 8px;
        font: var(--ft-m-medium);
        width: 350px;
        overflow: hidden;
        position: relative;
        transition: all ease-in-out 350ms;
    }

    .flash-enter, .flash-leave-to {
        opacity: 0;
        transform: translateX(50%);
        filter: blur(2px);
        transition-delay: 0ms;
    }

    .flash-leave-active {
        position: absolute;
        transition: all ease-in-out 200ms;
        transition-delay: 0ms;
    }

    .flash-move {
        transition: all ease-in-out 200ms;
        transition-delay: 250ms;
    }

    .Flashes_content {
        padding: 15px 0;
    }

    .Flashes_itemTitle {
        line-height: 1.2;
    }
    .Flashes_icon {
        font-size: 18px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 5px;
        flex-shrink: 0;
    }

    .Flashes_actions {
        width: 30px;
        flex-shrink: 0;
        display: flex;
        margin-left: 5px;
        flex-direction: column;
    }

    .Flashes_progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: 100%;
        transform-origin: left;
        background-color: black;
        animation: flashProgress var(--duration, 3000ms) linear;
    }

    @keyframes flashProgress {
        0% {
            transform: scaleX(0);
        }

        100% {
            transform: scaleX(1);
        }
    }

    .Flashes_action {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-top: 1px solid var(--color-border);
        border-left: 1px solid var(--color-border);
        
        i {
            transition: all 100ms ease;
        }

        &:hover i {
            opacity: 0.5;
            transform: scale(0.9);
        }

        &:first-child {
            border-top: none;
        }

        &:only-child {
            border: none;
        }
    }

    .Flashes_item.is-error {
        background-color: var(--color-gum-strong);

        .Flashes_actions,
        .Flashes_action {
            border-color: var(--color-gum-xstrong);
        }

        .Flashes_progress {
            background-color: var(--color-gum-xstrong);
        }

        .Flashes_itemText {
        font: var(--ft-s);
            color: var(--color-gum-xweak);
        }
    }
    .Flashes_item.is-success {
        background-color: var(--color-emerald-strong);

        .Flashes_actions,
        .Flashes_action {
            border-color: var(--color-emerald-xstrong);
        }

        .Flashes_progress {
            background-color: var(--color-emerald-xstrong);
        }

        .Flashes_itemText {
        font: var(--ft-s);
            color: var(--color-emerald-xweak);
        }
    }
</style>