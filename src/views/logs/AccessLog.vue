<template>
  <div>
    <log-wrapper :endpoint="endpoint"></log-wrapper>
  </div>
</template>

<script>
import LogWrapper from '@/components/LogWrapper'

export default {
  name: 'AccessLog',
  data () {
    return {
      endpoint: 'access'
    }
  },
  components: {
    logWrapper: LogWrapper
  }
}
</script>
