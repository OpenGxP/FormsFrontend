<template>
  <div>
    <base-table
      vlink="admin/permissions"
      vkey="key"
      vname="Permissions"
    >
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'Permissions',
  components: {
    baseTable: BaseTable
  }
}
</script>
