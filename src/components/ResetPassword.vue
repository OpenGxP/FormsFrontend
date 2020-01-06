<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex
      xs12
      sm8
      md4
    >
      <v-card class="elevation-12">
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>{{ dialogName }}</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="username"
              autofocus
              prepend-icon="person"
              name="login"
              label="Username"
              type="text"
              :error="err"
              :error-messages="errMsgs"
              @keyup.enter="login()"
            />
            <v-text-field
              id="oldPassword"
              v-model="oldPassword"
              prepend-icon="lock"
              :append-icon="show1 ? 'visibility_off' : 'visibility'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="oldPassword"
              label="Old Password"
              :error="err"
              :error-messages="errMsgs"
              @click:append="show1 = !show1"
              @keyup.enter="login()"
            />
            <v-text-field
              id="newPassword"
              v-model="newPassword"
              prepend-icon="lock"
              :append-icon="show2 ? 'visibility_off' : 'visibility'"
              :rules="[rules.required, rules.min, rules.match]"
              :type="show2 ? 'text' : 'password'"
              name="newPassword"
              label="New Password"
              :error="err"
              :error-messages="errMsgs"
              @click:append="show2 = !show2"
              @keyup.enter="login()"
            />
            <v-text-field
              id="confirm"
              v-model="newPasswordConfirm"
              prepend-icon="lock"
              :append-icon="show2 ? 'visibility_off' : 'visibility'"
              :rules="[rules.required, rules.min, rules.match]"
              :type="show2 ? 'text' : 'password'"
              name="confirm"
              label="Confirm New Password"
              :error="err"
              :error-messages="errMsgs"
              @click:append="show2 = !show2"
              @keyup.enter="login()"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'Login',

  props: {
    dialogName: {
      type: String,
      default: 'New Password'
    }
  },

  data () {
    return {
      err: false,
      errMsgs: [],
      color: 'primary',
      username: 'initial',
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      show1: false,
      show2: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        match: () => (this.password === this.confirm) || 'Passwords must match'
      }
    }
  },
  methods: {
    ...mapActions({
      // snackbar
      activate: 'snackbar/activate'
    }),
    save () {
      axios.patch('/user/change_password', {
        username: 'initial',
        password: 'Apfel1234',
        password_new: 'Daniel1234',
        password_new_verification: 'Daniel1234'
      })
        .then(resp => {
          if (resp.status === 200) {}
        })
        .catch(err => {
          this.activate({ color: 'error', message: err.response.data })
        })
    }
  }
}
</script>
