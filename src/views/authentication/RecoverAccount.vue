<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md8
        lg4
      >
        <v-card class="elevation-12">

          <v-card-title
            primary-title
            class="justify-center"
          >
            <span class="title font-weight-light">Forgot your password?</span>
          </v-card-title>

          <v-card-text>
            <v-form class="px-3">
              <template v-if="!sent">
                <v-text-field
                  v-model="recoveryMaildAdress"
                  autofocus
                  name="email"
                  label="We got you covered"
                  type="text"
                  :rules="[rules.required, rules.email]"
                  :error="err"
                  :error-messages="errMsgs"
                  @keyup.enter="sendRecoveryLink()"
                ></v-text-field>
              </template>
              <template v-if="sent">
                <p class="text-xs-center">
                  <v-icon
                    medium
                    color="green"
                  >
                    done

                  </v-icon>
                  <span> Message was succefully sent</span>
                </p>
              </template>
            </v-form>
          </v-card-text>

          <v-card-actions
            class="justify-center"
            v-if="!sent"
          >
            <v-btn
              @click="sendRecoveryLink()"
              color="primary"
            >Send recovery link</v-btn>
          </v-card-actions>

          <p
            class="text-center py-6"
          >
            <router-link
              style="text-decoration: none;"
              to="/login"
            >Return to login</router-link>
          </p>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data: () => ({
    err: false,
    errMsgs: [],
    sent: false,
    color: 'primary',
    recoveryMaildAdress: '',
    rules: {
      required: value => !!value || 'Required.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      }
    }
  }),
  methods: {
    sendRecoveryLink () {
      const email = this.recoveryMaildAdress
      axios.post('request_password_reset_email', { email })
        .then(resp => {
          this.sent = true
        })
        .catch(err => {
          this.err = true
          this.errMsgs = err.response.data
        })
    }
  }
}
</script>

<style>
</style>
