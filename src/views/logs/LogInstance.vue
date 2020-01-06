<template>
  <log-wrapper :endpoint="endpoint" />
</template>

<script>
import LogWrapper from '@/components/LogWrapper'

export default {
  name: 'LogInstance',
  components: {
    logWrapper: LogWrapper
  },

  data () {
    return {
      endpoint: this.$route.params.instance
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.endpoint = to.params.instance
    next()
  }
}
</script>

<style>

</style>
