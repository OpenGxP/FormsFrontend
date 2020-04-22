<template>
  <v-container>
    <v-card color="primary">
      <v-card-title>General</v-card-title>
      <v-card-text>

        <v-row>
          <v-col>
            <v-switch
              label="gui.darkmode"
              :value="profile['gui.darkmode'] === 'Yes'"
              @change="changeProfile($event, 'gui.darkmode')"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-switch
              label="gui.dense"
              :value="profile['gui.dense'] == 'Yes'"
              @change="changeProfile($event, 'gui.dense')"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select
              label="gui.pagination"
              :items="paginationoptions"
              :value="profile['gui.pagination']"
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      //
      test: 'en_EN',
      attributes: [],
      timezones: [],
      paginationoptions: [5, 10, 15, 25, 50, 100],
      //
      ct: '',
      timezone: '',
      myval: '',
      items: [],
      dialog: false,
      dia: false,
      err: false,
      errMsgs: [],
      password: '',
      password_new: '',
      password_new_verification: '',
      show1: false,
      show2: false,
      dark: false,
      dense: false,
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
    ...mapGetters({
      darkTheme: 'darkTheme',
      tableSettings: 'tableSettings'
    }),
    profile () {
      return this.$store.getters['user2/profile']
    }
  },

  methods: {
    ...mapActions({
      activate: 'snackbar/activate'
    }),
    // api calls
    patch (key, payload) {
      return this.$http.patch(`/user/profile/${key}`, payload)
    },
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
    edit () {
      const key = 'gui.dense'
      const payload = { value: 'Yes' }
      this.$http.patch(`user/profile/${key}`, payload)
    },
    ss () {
      if (this.ct) {
        this.timezone = this.ct
        this.patch('loc.timezone', { value: this.timezone })
      }
      this.dia = false
    },
    changeProfile (event, context) {
      switch (context) {
        case 'gui.darkmode':
        case 'gui.dense':
          this.$http.patch(`/user/profile/${context}`, { 'value': event })
            .then(this.$store.commit('setTheme', event ? 'Yes' : 'No'))
          break
        default:
          this.$http.patch(`/user/profile/${context}`, { 'value': event })
            .then(this.$store.commit('setTheme', event))
          break
      }
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
      this.patch('gui.darkmode', { 'value': val ? 'Yes' : 'No' })
        .then(this.$store.commit('setTheme', val ? 'Yes' : 'No'))
    },
    dense (val) {
      this.patch('gui.dense', { 'value': val ? 'Yes' : 'No' })
      //  .then(this.$store.commit(val ? 'Yes' : 'No'))
    },
    items: {
      immediate: true,
      handler (val) {
        if (this.itmes) {
          let timezone = this.items.find(obj => obj.key === 'loc.timezone')
          this.timezone = timezone.value
        }
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

    this.dark = this.darkTheme
    this.dense = this.tableSettings.dense
  }
}
</script>

<style>
</style>
