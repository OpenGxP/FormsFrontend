<template>
  <v-container>
    <div>{{ quick }}</div>
    <app-execution></app-execution>
  </v-container>
</template>

<script>
import appExecution from '@/components/execution'

export default {
  data: () => ({
    quick: 'test'
  }),

  components: {
    appExecution
  }
}
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
