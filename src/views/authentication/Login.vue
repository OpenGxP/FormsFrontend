<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
      wrap
    >

      <v-flex
        xs12
        sm8
        md8
        lg4
      >
        <div class="display-3 text-center pb-12 hidden-sm-and-down">OpenGxP FORMS</div>
        <v-card class="elevation-12">
          <v-card-title
            primary-title
            class="justify-center"
          >
            <span class="title font-weight-light">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3">
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
              <p class="text-right">
                <router-link
                  style="text-decoration: none;"
                  to="/recoveraccount"
                >Forgot your password?</router-link>
              </p>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn
              @click="login"
              color="primary"
            >Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'login',
  data: () => ({
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
  }),
  methods: {
    login () {
      const username = this.username
      const password = this.password
      this.$store.dispatch('login', { username, password })
        .then(resp => {
          if (resp.data.initial_password) {
            this.$router.push('/newpassword')
          } else {
            this.$store.dispatch('initialize')
            this.$store.dispatch('get')
            this.$store.commit('login')
            this.$router.push('/')
          }
        })
        .catch(() => {
          this.err = true
          this.errMsgs = this.$store.getters.errMsg
        })
    }
  }
}
</script>
