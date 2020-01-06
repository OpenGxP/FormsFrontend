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
      text
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
      //
    }
  },

  methods: {
    ...mapActions({
      hide: 'global/snackbar/hide',
      show: 'global/snackbar/show',
      setActive: 'global/snackbar/setActive'
    })
  },

  computed: {
    active: {
      get () {
        return this.$store.getters['global/snackbar/isActive']
      },
      set (newValue) {
        this.setActive(newValue)
      }
    },
    options () {
      return this.$store.getters['global/snackbar/snackOptions']
    }
  }
}
</script>

<style>

</style>
