<template>

  <app-section></app-section>

</template>

<script>
import appSection from '@/components/SectionWrapper'

export default {
  data () {
    return {
      tab: null,
      operators: ['contains', 'exact', 'startswith', 'endswith']
    }
  },

  components: {
    appSection
  }
}
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
