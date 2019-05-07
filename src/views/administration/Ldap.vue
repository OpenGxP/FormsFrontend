<template>
  <div>
    <base-table 
    	vlink="admin/ldap"
    	vname="LDAP"
    >
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'

export default {
  name: 'Ldap',
  components: {
    baseTable: BaseTable
  }
}
</script>
