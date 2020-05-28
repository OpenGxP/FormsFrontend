<template>
  <v-container>
    <v-row>
      <v-col>
        <div
          style="margin-bottom: 40px;"
          class="display-3"
        >
          404 - Page not found
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <img src="https://media.giphy.com/media/mBYPAiqYlrM5FyzWXM/giphy.gif">
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          v-if="auth"
          @click="goBack"
        >
          Return to previous page
        </v-btn>
        <v-btn to="/">
          {{ msg }}
        </v-btn>
      </v-col>
    </v-row>
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
