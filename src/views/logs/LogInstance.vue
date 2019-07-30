<template>
    <log-wrapper :endpoint="endpoint"></log-wrapper>
</template>

<script>
import LogWrapper from '@/components/LogWrapper'

export default {
  name: 'LogInstance',

  data () {
    return {
      endpoint: this.$route.params.instance
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.endpoint = to.params.instance
    next()
  },
  components: {
    logWrapper: LogWrapper
  }
}
</script>

<style>

</style>
