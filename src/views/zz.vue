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
    <v-btn @click="activate({mode: 'warning', text: 'eofkoefoef'})"></v-btn>
    <!--<app-graph></app-graph>-->
      <!--<app-date-time-picker
        :dateTimeProp="dt"
        @change-val="dt = $event"
      ></app-date-time-picker>-->
      <!--<app-workflow-designer></app-workflow-designer>-->
      <!--<app-navigation-grid></app-navigation-grid>-->
    </v-container>
  </v-card>
</template>

<script>
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'
import AppWorkflowDesigner from '@/components/inputs/AppWorkflowDesigner'
import AppNavigationGrid from '@/components/AppNavigationGrid.vue'
import AppGraph from '@/components/AppGraph.vue'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      dt: '2019-07-26T13:46:25.340722Z'
    }
  },

  components: {
    appDateTimePicker: AppDateTimePicker,
    appWorkflowDesigner: AppWorkflowDesigner,
    appNavigationGrid: AppNavigationGrid,
    appGraph: AppGraph
  },

  methods: {
    ...mapActions({
      show: 'global/overlay/show',
      hide: 'global/banner/hide',
      activate: 'global/overlay/activate'
    })
  }
}
</script>

<style>
</style>
