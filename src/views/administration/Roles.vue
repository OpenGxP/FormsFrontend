<template>
  <div>
    <base-table
      vlink="admin/roles"
      vname="Roles"
    ></base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'Roles',
  data () {
    return {
      editable: true
    }
  },
  components: {
    baseTable: BaseTable
  }
}
</script>
