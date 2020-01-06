<template>
  <v-container>
    <v-layout>
      <v-flex>
        <div
          style="margin-bottom: 40px;"
          class="display-3"
        >
          404 - Page not found
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-btn
          v-if="auth"
          @click="goBack"
        >
          Return to previous page
        </v-btn>
        <v-btn to="/">
          {{ msg }}
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound',
  computed: {
    msg () {
      if (this.auth) {
        return 'Return to home page'
      } else {
        return 'Return to login page'
      }
    },
    auth () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>
