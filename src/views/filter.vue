<template>
  <div>
    <div>{{ quick }}</div>
    <quick-filter v-model="quick"></quick-filter>
  </div>
</template>

<script>
import quickFilter from '@/components/AppQuickfilter'

export default {
  data: () => ({
    quick: 'test'
  }),

  components: {
    quickFilter
  }
}
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
