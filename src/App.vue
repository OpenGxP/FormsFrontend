<template>
  <v-app v-hotkey="keymap">
    <app-banner></app-banner>
    <app-toolbar v-if="isAuthenticated" />
    <app-snack-bar></app-snack-bar>
    <app-overlay></app-overlay>
    <v-content>
      <router-view />
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import TheToolBar from '@/components/TheToolBar'
import TheFoorter from '@/components/TheFooter'
import TheSnackBar from '@/components/TheSnackBar'
import TheOverlay from '@/components/TheOverlay'
import TheBanner from '@/components/globals/TheBanner'

export default {
  name: 'App',

  components: {
    appToolbar: TheToolBar,
    appFooter: TheFoorter,
    appSnackBar: TheSnackBar,
    appOverlay: TheOverlay,
    appBanner: TheBanner
  },

  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    keymap () {
      return {
        'F1': this.nice
      }
    }
  },

  methods: {
    nice () {
      if (this.isAuthenticated) this.$store.dispatch('authentication/logout')
    }
  },

  created () {
    window.addEventListener('beforeunload', event => {
      // TODO: check authentication state
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ''
    })
  }
}
</script>
