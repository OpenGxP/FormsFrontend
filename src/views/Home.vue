<template>
  <div>
    <v-container
      fluid
      grid-list-xl
    >
      <v-layout
        row
        wrap
        text-center
      >
        <v-flex xs12>
          <div
            class="display-3"
            style="padding-top: 30px;"
          >{{msg}}
          </div>
        </v-flex>
        <v-flex xs12>
          <div style="height: 50px;"></div>
        </v-flex>
      </v-layout>

      <app-navigation-grid></app-navigation-grid>
    </v-container>
  </div>
</template>

<script>
import AppNavigationGrid from '@/components/AppNavigationGrid.vue'

export default {
  name: 'Home',

  data: function () {
    return {
      msg: 'Welcome to OpenGxP'
    }
  },

  components: {
    appNavigationGrid: AppNavigationGrid
  }
}
</script>
