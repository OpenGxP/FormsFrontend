<template>
  <v-container>
    <v-card color="secondary">
      <v-card-title>General</v-card-title>
      <v-card-text>

        <v-row>
          <v-col>
            <v-switch
              :input-value="profile['gui.darkmode']"
              label="gui.darkmode"
              false-value="No"
              true-value="Yes"
              @change="changeProfile($event, 'gui.darkmode')"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-switch
              :input-value="profile['gui.dense']"
              label="gui.dense"
              false-value="No"
              true-value="Yes"
              @change="changeProfile($event, 'gui.dense')"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select
              :value="parseInt(profile['gui.pagination'])"
              label="gui.pagination"
              :items="paginationoptions"
              @change="changeProfile($event, 'gui.pagination')"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-autocomplete
              label="loc.language"
              :disabled="true"
              placeholder="en_EN"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-autocomplete
              label="loc.timezone"
              :items="timezones"
              :value="profile['loc.timezone']"
              @change="changeProfile($event, 'loc.timezone')"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  color="primary"
                  v-on="on"
                >Reset Password</v-btn>
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
                      id="oldPassword"
                      v-model="password"
                      prepend-icon="lock"
                      :append-icon="show1 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="oldPassword"
                      label="Old Password"
                      :error="err"
                      :error-messages="errMsgs"
                      @click:append="show1 = !show1"
                      @keyup.enter="save()"
                    />
                    <v-text-field
                      id="newPassword"
                      v-model="password_new"
                      prepend-icon="lock"
                      :append-icon="show2 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show2 ? 'text' : 'password'"
                      name="newPassword"
                      label="New Password"
                      :error="err"
                      :error-messages="errMsgs"
                      @click:append="show2 = !show2"
                      @keyup.enter="save()"
                    />
                    <v-text-field
                      id="confirm"
                      v-model="password_new_verification"
                      prepend-icon="lock"
                      :append-icon="show2 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min, rules.match]"
                      :type="show2 ? 'text' : 'password'"
                      name="confirm"
                      label="Confirm New Password"
                      :error="err"
                      :error-messages="errMsgs"
                      @click:append="show2 = !show2"
                      @keyup.enter="save()"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="primary"
                    text
                    @click="dialog = false"
                  >Cancel</v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="save"
                  >Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      //
      timezones: [],
      paginationoptions: [5, 10, 15, 25, 50, 100],
      //
      myval: '',
      items: [],
      dialog: false,
      err: false,
      errMsgs: [],
      password: '',
      password_new: '',
      password_new_verification: '',
      show1: false,
      show2: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        match: () =>
          this.password_new === this.password_new_verification ||
          'Passwords must match'
      }
    }
  },

  computed: {
    profile () {
      return this.$store.getters['user2/profile']
    }
  },

  methods: {
    ...mapActions({
      activate: 'snackbar/activate'
    }),
    // api calls
    changePassword (payload) {
      return this.$http.patch('user/change_password', payload)
    },
    // end api calls
    save () {
      const password = this.password
      const passwordNew = this.password_new
      const passwordNewVerification = this.password_new_verification
      axios({
        method: 'patch',
        url: '/user/change_password',
        data: {
          password,
          'password_new': passwordNew,
          'password_new_verification': passwordNewVerification
        },
        withCredentials: true
      })
        .then(resp => {
          this.dialog = false
          this.activate({
            color: 'success',
            message: 'password was successfully reset'
          })
        })
        .catch(err => {
          this.errMsgs = err.response.data
          this.err = true
          this.activate({ color: 'error', message: this.errMsgs })
        })
    },
    changeProfile (event, context) {
      this.$http.patch(`/user/profile/${context}`, { 'value': event })
        .then(() => {
          this.$store.dispatch('user2/changeProfile', { [context]: event })
          if (context === 'gui.darkmode') this.$store.commit('setTheme', event)
        })
    }
  },

  watch: {
    // reset pw data
    dialog (val) {
      if (!val) {
        this.password = ''
        this.password_new = ''
        this.password_new_verification = ''
      }
    }
  },

  mounted () {
    //
    this.$store.dispatch('user2/getProfileData')
    this.$http.get('meta/set_timezone').then(resp => {
      this.timezones = resp.data.post.value.lookup.data
    })
    //
    this.$http.get('user/profile').then(resp => {
      this.items = resp.data.results
    })
  }
}
</script>

<style>
</style>
