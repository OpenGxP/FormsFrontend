<template>
  <v-snackbar
    v-model="active"
    :color="color"
    :timeout="timeout"
    auto-height
  >
    {{ text }}
    <!--<v-btn
      dark
      flat
      @click="deactivate()"
    >
      Close
    </v-btn>-->
  </v-snackbar>
</template>

<script>
export default {
  name: 'AppSnackbar',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Test'
    },
    color: {
      type: String,
      default: 'primary'
    },
    timeout: {
      type: Number,
      default: 5000
    }
  },
  methods: {
    deactivate () {
      this.active = false
    }
  }
}
</script>
