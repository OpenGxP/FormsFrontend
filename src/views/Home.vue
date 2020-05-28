<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <div
          class="display-3 text-center"
          style="padding-top: 50px;"
        >Welcome to openGxP</div>
      </v-col>
    </v-row>
    <app-dashboard></app-dashboard>
  </v-container>
</template>

<script>
import appDashboard from '@/components/TheDashboard'

export default {

  components: {
    appDashboard
  }
}
</script>
