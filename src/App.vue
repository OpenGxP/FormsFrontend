<template>
  <v-app>
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
    }
  },

  created () {
    window.addEventListener('beforeunload', event => {
      // TODO: check authentication state
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ''
    })
  },

  mounted () {
    // for scoping
    /*
    var vm = this
    window.addEventListener('keyup', function (event) {
      if (event.keyCode === 112) {
        vm.newItem()
      }
    })
    */
  }
}
</script>
