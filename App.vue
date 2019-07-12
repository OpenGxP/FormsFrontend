<template>
  <v-app>
    
    <app-toolbar v-if="isAuthenticated"/>
    <snack-bar></snack-bar>
    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>
import TheToolBar from '@/components/TheToolBar'
import SnackBar from '@/components/helpers/SnackBar'

export default {
  name: 'App',
  components: {
    appToolbar: TheToolBar,
    snackBar: SnackBar
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>
