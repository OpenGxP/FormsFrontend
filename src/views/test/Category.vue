<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
export default {
  data () {
    return {
      cat: ''
    }
  },

  props: ['category']
}
</script>

<style></style>
