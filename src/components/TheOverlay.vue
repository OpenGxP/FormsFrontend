<template>
  <v-overlay :value="active" :absolute="true" :opacity="0.5" :z-index="100" :color="config.color">
    <v-card width="300">
      <v-card-title>Global Shortcuts</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row v-for="(entry, index) in globals" :key="index">
          <v-col v-text="entry.title" />
          <v-col>
            <span>
              <kbd>{{entry.markup1}}</kbd> +
              <kbd>{{entry.markup2}}</kbd>
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="hide()">Hide</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheOverlay',

  data () {
    return {
      globals: [
        { title: 'Toggle Toolbar', markup1: 'shift', markup2: 'space' },
        { title: 'Toggle Search', markup1: 'shift', markup2: 'enter' }
      ]
    }
  },

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
