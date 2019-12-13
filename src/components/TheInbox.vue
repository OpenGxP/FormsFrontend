<template>
  <base-table
    vlink="inbox"
    :config="config"
  >
  </base-table>
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'TheInbox',

  data () {
    return {
      endpoint: this.$route.params.instance,
      config: {
        delete: false,
        patch: false,
        post: false,
        title: 'Inbox',
        version: false,
        url: {
          rel: 'user/inbox'
        },
        log: {}
      }
    }
  },

  components: {
    baseTable: BaseTable
  }
}
</script>

<style>
</style>
