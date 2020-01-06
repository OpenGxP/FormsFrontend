<template>
  <base-table
    :vlink="endpoint"
    :config="instanceConfig"
  />
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'MasterDataInstance',

  components: {
    baseTable: BaseTable
  },

  data () {
    return {
      endpoint: this.$route.params.instance
    }
  },

  computed: {
    instanceConfig () {
      return this.$store.getters.data[this.$route.params.category]['subjects'][this.$route.params.instance]
    }
  },

  beforeRouteUpdate (to, from, next) {
    this.endpoint = to.params.instance
    this.$forceUpdate()
    next()
  }
}
</script>

<style>

</style>
