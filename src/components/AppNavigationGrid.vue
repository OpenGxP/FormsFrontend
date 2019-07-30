<template>
  <v-layout
    wrap
    justify-center
  >

    <template v-for="(value, key, index) in items">

      <v-flex
        xs2
        :key="index"
      >
        <v-card
          class="white--text"
          color="indigo"
          elevation="10"
        >
          <v-card-title class="title">{{ value.title }}</v-card-title>
          <v-card-text>Lorem ipsum dolor sit, amet consectetur adipisicing elit. In, iste?</v-card-text>
        </v-card>
      </v-flex>

    </template>

  </v-layout>
</template>

<script>
export default {
  name: 'AppNavigationGrid',

  data () {
    return {
      items: this.$store.getters.data
    }
  }
}
</script>

<style>
</style>
