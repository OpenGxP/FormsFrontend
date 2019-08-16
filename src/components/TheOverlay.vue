<template>
  <v-overlay
    :value="active"
    :absolute="true"
    :opacity="0.5"
    :z-index="100"
    :color="config.color"
  >
    <v-btn
      color="primary"
      @click="hide()"
    >
      Hide Overlay
    </v-btn>
  </v-overlay>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheOverlay',

  computed: {
    ...mapGetters({
      active: 'global/overlay/active',
      config: 'global/overlay/mode',
      text: 'global/overlay/text'
    })
  },

  methods: {
    ...mapActions({
      show: 'global/overlay/show',
      hide: 'global/overlay/hide',
      activate: 'global/overlay/activate'
    })
  }
}
</script>

<style>
</style>
