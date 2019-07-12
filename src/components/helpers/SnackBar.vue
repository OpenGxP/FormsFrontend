<template>
    <v-snackbar
      v-model="active"
      :color="options.color"
      :bottom="options.y === 'bottom'"
      :left="options.x === 'left'"
      :multi-line="options.mode === 'multi-line'"
      :right="options.x === 'right'"
      :timeout="options.timeout"
      :top="options.y === 'top'"
      :vertical="options.mode === 'vertical'"
    >
      {{ options.message }}
      <v-btn
        flat
        @click="hide()"
      >
        Close
      </v-btn>
    </v-snackbar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            text: 'Hello'
        }
    },

    methods: {
        ...mapActions({
            hide: 'hide',
            show: 'show',
            setActive: 'setActive'
        })
    },

    computed: {
        active: {
            get () {
                return this.$store.getters.isActive
            },
            set (newValue) {
                this.setActive(newValue)
            }
        },
        options () {
            return this.$store.getters.snackOptions
        }
    }
}
</script>

<style>

</style>
