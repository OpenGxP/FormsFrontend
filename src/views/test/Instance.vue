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

  props: ['instance']
}
</script>

<style></style>
