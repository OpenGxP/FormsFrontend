<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      //
    }
  }
}
</script>

<style></style>
