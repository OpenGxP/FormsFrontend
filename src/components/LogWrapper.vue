<template>
    <log-table :endpoint="endpoint"></log-table>
</template>

<script>
import LogTable from '@/components/LogTable'

export default {
  name: 'LogWrapper',
  props: [
    'endpoint'
  ],
  components: {
    logTable: LogTable
  }
}
</script>

<style>

</style>
