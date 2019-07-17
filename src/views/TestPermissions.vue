<template>

  <div>
  
 
  <permission-dialog></permission-dialog>
  <permission-allocation></permission-allocation>



  </div>

</template>

<script>
import axios from 'axios'
import PermissionDialog from '@/components/PermissionDialog'
import PermissionAllocation from '@/components/inputs/PermissionAllocation'

  export default {
    data: () => ({
      //
    }),

    components: {
      permissionDialog: PermissionDialog,
      permissionAllocation: PermissionAllocation
    }
  }
</script>