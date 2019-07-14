<template>
    <base-table
      :vlink="endpoint"
      :lifecycleManaged="managed"
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
          endpoint: this.$route.params.instance,
          config: this.$store.getters.configuration
      }
  },

  computed: {
    managed () {
      if(this.config[this.endpoint]['version']) return true
      return false 
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
