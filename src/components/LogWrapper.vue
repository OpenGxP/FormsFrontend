<template>
  <log-table :endpoint="endpoint" />
</template>

<script>
import LogTable from '@/components/LogTable'

export default {
  name: 'LogWrapper',
  components: {
    logTable: LogTable
  },
  props: [
    'endpoint'
  ]
}
</script>

<style>

</style>
