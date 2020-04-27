<template>
  <v-overlay
    :value="active"
    :absolute="true"
    :opacity="0.5"
    :z-index="100"
    :color="config.color"
  >
    <v-card width="700">
      <v-card-title>Keyboard shortcuts</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col
            v-for="map in keyMaps"
            :key="map.category"
            cols="6"
          >
            <v-card
              flat
              class="px-2"
            >
              <v-row
                v-text="map.category"
                class="subtitle-1 font-weight-bold"
              ></v-row>
              <v-row
                v-for="shortcut in map.shortcuts"
                :key="shortcut.title"
              >
                <v-col v-text="shortcut.title" />
                <v-col>
                  <span
                    v-for="markup in shortcut.markup"
                    :key="markup"
                  >
                    <kbd>{{ markup }}</kbd>
                    <span v-if="shortcut.markup.length > 1 && markup !== shortcut.markup.slice(-1)[0]"> + </span>
                  </span>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          color="primary"
          @click="hide()"
        >Hide</v-btn>
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
      keyMaps: [
        {
          category: 'Global shortcuts',
          shortcuts: [
            { title: 'Toggle toolbar', markup: ['shift', 'space'] },
            { title: 'Toggle search', markup: ['shift', 'enter'] },
            { title: 'Log out', markup: ['F1'] },
            { title: 'Keyboard shortcuts', markup: ['?'] }
          ]
        },
        {
          category: 'Actions',
          shortcuts: [
            { title: 'Create entry', markup: ['c'] },
            { title: 'Edit entry', markup: ['e'] },
            { title: 'View entry', markup: ['v'] },
            { title: 'Delete entry', markup: ['d'] }
          ]
        },
        {
          category: 'Navigation',
          shortcuts: [
            { title: 'Navigate home', markup: ['g'] }
          ]
        }
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
