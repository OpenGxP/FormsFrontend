<template>
  <base-table
    vlink="inbox"
    :config="config"
  />
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'TheInbox',

  components: {
    baseTable: BaseTable
  },

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
  }
}
</script>

<style>
</style>
