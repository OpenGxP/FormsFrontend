<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      test: ''
    }
  },

  props: ['id']
}
</script>

<style></style>
