<template>
  <v-app>
    <app-toolbar v-if="isAuthenticated" />
    <snack-bar></snack-bar>
    <v-content>
      <router-view />
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import TheToolBar from '@/components/TheToolBar'
import TheFoorter from '@/components/TheFooter'
import SnackBar from '@/components/helpers/SnackBar'

export default {
  name: 'App',
  components: {
    appToolbar: TheToolBar,
    appFooter: TheFoorter,
    snackBar: SnackBar
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>
