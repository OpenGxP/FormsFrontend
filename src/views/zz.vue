<template>
  <v-card
    max-width="800"
    class="mx-auto"
    style="margin-top: 50px;"
  >
    <v-container
      class="pa-2"
      fluid
      grid-list-md
    >
    {{dt}}
      <app-date-time-picker
        :dateTimeProp="dt"
        @change-val="dt = $event"
      ></app-date-time-picker>
      <!--<app-workflow-designer></app-workflow-designer>-->
      <!--<app-navigation-grid></app-navigation-grid>-->
    </v-container>
  </v-card>
</template>

<script>
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'
import AppWorkflowDesigner from '@/components/inputs/AppWorkflowDesigner'
import AppNavigationGrid from '@/components/AppNavigationGrid.vue'

export default {
  data () {
    return {
      dt: '2019-07-26T13:46:25.340722Z'
    }
  },

  components: {
    appDateTimePicker: AppDateTimePicker,
    appWorkflowDesigner: AppWorkflowDesigner,
    appNavigationGrid: AppNavigationGrid
  }
}
</script>

<style>
</style>
