<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="username"
                autofocus
                prepend-icon="person"
                name="login"
                label="Login"
                type="text"
                :error="err"
                :error-messages="errMsgs"
                @keyup.enter="login()"
              ></v-text-field>
              <v-text-field
                v-model="password"
                prepend-icon="lock"
                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="password"
                label="Password"
                id="password"
                :error="err"
                :error-messages="errMsgs"
                @click:append="show1 = !show1"
                @keyup.enter="login()"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="login" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      err: false,
      errMsgs: [],
      color: 'primary',
      username: '',
      password: '',
      show1: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters'
      }
    }
  },
  methods: {
    login () {
      const username = this.username
      const password = this.password
      this.$store.dispatch('login', { username, password })
      /*
      this.err = true
      this.errMsgs = this.$store.getters.errMsg
      */
    }
  }
}
</script>
