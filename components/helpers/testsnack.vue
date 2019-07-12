<template>
  <v-snackbar 
    v-model="rab"
    :left="snackbar.direction === 'left'"
    :right="snackbar.direction === 'rigth'"
    :top="snackbar.direction === 'top'"
    :bottom="snackbar.direction === 'bottom'"
    :color="snackbar.color"
    :multi-line="snackbar.mode === 'multi-line'"
    :timeout="snackbar.timeout"
    :vertical="snackbar.mode === 'vertical'"
  >
    {{ snackbar.message }}
    <v-btn
        flat
        color="accent" 
        @click="$emit('hides')"
    >
        Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: ['value'],


  data () {
    return {
      snackbarVisible: false,
      snackbar: {
        enabled: false,
        color: 'success',
        mode: 'multi-line',
        timeout: 4000,
        message: 'Success!',
        callback: null,
        location: 'bottom',
      }
    }
  },

  methods: {
      hideSnackbar(){
        this.snackbarVisible = false
        if( this.snackbar.callback ){
          this.snackbar.callback()
        }
      },
      /**
       * Show Snackbar
       * @param {string} message
       * @param {object} snackbarOptions
       */
      showSnackbar( message, snackbarOptions ){
        if( message ){
          this.snackbar.message = message
        }
        this.snackbar.enabled = true
        if( typeof snackbar === 'object' ){
          this.snackbar = Object.assign(this.snackbar, snackbarOptions)
        }
        this.snackbarVisible = true
      }
  },

  computed: {
    rab () {
      return this.value
    }
  }

}
</script>
