<template>
  <v-container>
    <v-layout row>

      <v-flex
        xs12
        sm3
        offset-sm3
      >

        <v-list two-line>

          <v-subheader>General</v-subheader>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Username</v-list-item-title>
              <v-list-item-subtitle>{{info}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Status</v-list-item-title>
              <v-list-item-subtitle>Online</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Dark Mode</v-list-item-title>
              <v-list-item-subtitle>{{ dark }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="dark"></v-switch>
            </v-list-item-action>
          </v-list-item>

          <v-list-item
            v-for="item in items"
            :key="item.unique"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.key }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="item.value === 'Yes' || item.value === 'No'">
              <v-switch
              ></v-switch>
            </v-list-item-action>
          </v-list-item>

        </v-list>

      </v-flex>

      <v-flex offset-sm1>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              color="primary"
              v-on="on"
            >
              Reset Password
            </v-btn>
          </template>

          <v-card class="elevation-12">
            <v-card-title
              primary-title
              class="justify-center"
            >
              <span class="title font-weight-light">Set New Password</span>
            </v-card-title>
            <v-card-text>
              <v-form class="px-3">
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  :append-icon="show1 ? 'visibility_off' : 'visibility'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="oldPassword"
                  label="Old Password"
                  id="oldPassword"
                  :error="err"
                  :error-messages="errMsgs"
                  @click:append="show1 = !show1"
                  @keyup.enter="save()"
                ></v-text-field>
                <v-text-field
                  v-model="password_new"
                  prepend-icon="lock"
                  :append-icon="show2 ? 'visibility_off' : 'visibility'"
                  :rules="[rules.required, rules.min]"
                  :type="show2 ? 'text' : 'password'"
                  name="newPassword"
                  label="New Password"
                  id="newPassword"
                  :error="err"
                  :error-messages="errMsgs"
                  @click:append="show2 = !show2"
                  @keyup.enter="save()"
                ></v-text-field>
                <v-text-field
                  v-model="password_new_verification"
                  prepend-icon="lock"
                  :append-icon="show2 ? 'visibility_off' : 'visibility'"
                  :rules="[rules.required, rules.min, rules.match]"
                  :type="show2 ? 'text' : 'password'"
                  name="confirm"
                  label="Confirm New Password"
                  id="confirm"
                  :error="err"
                  :error-messages="errMsgs"
                  @click:append="show2 = !show2"
                  @keyup.enter="save()"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                @click="dialog = false"
                color="primary"
              >Cancel</v-btn>
              <v-btn
                @click="save"
                color="primary"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {

  data () {
    return {
      myval: '',
      items: [],
      dialog: false,
      info: '',
      err: false,
      errMsgs: [],
      password: '',
      password_new: '',
      password_new_verification: '',
      show1: false,
      show2: false,
      dark: this.$vuetify.theme.dark,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        match: () => (this.password_new === this.password_new_verification) || 'Passwords must match'
      }
    }
  },

  methods: {
    ...mapActions(
      {
        activate: 'snackbar/activate'
      }
    ),
    save () {
      const password = this.password
      const password_new = this.password_new
      const password_new_verification = this.password_new_verification
      axios({
        method: 'patch',
        url: '/user/change_password',
        data: { password, password_new, password_new_verification },
        withCredentials: true
      })
        .then(resp => {
          this.dialog = false
          this.activate({ color: 'success', message: 'password was successfully reset' })
        })
        .catch(err => {
          this.errMsgs = err.response.data
          this.err = true
          this.activate({ color: 'error', message: this.errMsgs })
        })
    },
    edit () {
      const key = 'gui.dense'
      const payload = { value: 'Yes' }
      this.$http.patch(`user/profile/${key}`, payload)
    }
  },

  watch: {
    dialog (val) {
      if (!val) {
        this.password = ''
        this.password_new = ''
        this.password_new_verification = ''
      }
    },
    dark (val) {
      this.$vuetify.theme.dark = val
      // this.$vuetify.theme.themes.dark.primary = '#4caf50'
    }
  },

  mounted () {
    this.info = this.$store.getters.currentUser
    this.$http.get('user/profile')
      .then(resp => { this.items = resp.data })
  }
}
</script>

<style>
</style>
