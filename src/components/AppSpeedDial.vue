<template>
  <v-speed-dial
    v-model="fab"
    :direction="direction"
    fixed
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon v-if="fab">
          close
        </v-icon>
        <v-icon v-else>
          account_circle
        </v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      small
      color="green"
    >
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="indigo"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="red"
    >
      <v-icon>delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  data () {
    return {
      fab: false,
      direction: 'bottom'
    }
  }
}
</script>

<style>
</style>
