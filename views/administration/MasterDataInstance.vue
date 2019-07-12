<template>
    <base-table
      :vlink="endpoint"
      vkey="key"
      vname="endpoint"
    >
    </base-table>
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'MasterDataInstance',
  
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
    baseTable: BaseTable
  }
}
</script>

<style>

</style>
