<template>
  <div>
    <base-table
    	vlink="admin/users"
    	vname="Users"
    ></base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'Users',
  components: {
    baseTable: BaseTable
  }
}
</script>
