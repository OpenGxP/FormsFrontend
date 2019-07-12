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
        @click="$emit('hides')"
    >
        Close
    </v-btn>
  </v-snackbar>
</template>


<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    snackbar: {
      type: Object,
      default () {
        return {
          color: 'success',
          mode: 'multi-line',
          timeout: 4000,
          message: 'Success!',
          location: 'top'
        }
      }
    }
  },

  data () {
    return {
      snackbarVisible: false,

    }
  },

  computed: {
    rab: {
      get () {
        return this.value
      },
      set (newValue) {
        this.value = newValue
      }
    }
  }

}
</script>
