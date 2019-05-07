<template>
  <v-app>
    
    <app-toolbar v-if="isAuthenticated"/>

    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>
import TheToolBar from '@/components/TheToolBar'

export default {
  name: 'App',
  components: {
    appToolbar: TheToolBar
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>
