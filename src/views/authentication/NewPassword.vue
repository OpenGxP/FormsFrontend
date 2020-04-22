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

        <v-stepper v-model="e">

          <v-stepper-header>
            <v-stepper-step
              :complete="!initialPassword"
              step="1"
            >
              Set new password
            </v-stepper-step>
            <v-stepper-step
              :complete="!initialTimezone"
              step="2"
            >
              Set timezone
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">

              <v-card class="elevation-12">
                <v-card-title
                  primary-title
                  class="justify-center"
                >
                  <span class="title font-weight-light">New Password</span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-3">
                    <v-text-field
                      id="oldPassword"
                      v-model="oldPassword"
                      autofocus
                      prepend-icon="lock"
                      :append-icon="show1 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="oldPassword"
                      label="Old Password"
                      :error="err"
                      :error-messages="errMsgs"
                      @click:append="show1 = !show1"
                      @keyup.enter="savePassword()"
                    />
                    <v-text-field
                      id="newPassword"
                      v-model="newPassword"
                      prepend-icon="lock"
                      :append-icon="show2 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show2 ? 'text' : 'password'"
                      name="newPassword"
                      label="New Password"
                      :error="err"
                      :error-messages="errMsgs"
                      @click:append="show2 = !show2"
                      @keyup.enter="savePassword()"
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
                      @keyup.enter="savePassword()"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="primary"
                    @click="savePassword()"
                  >Save</v-btn>
                </v-card-actions>
              </v-card>

            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card>
                <v-card-title
                  primary-title
                  class="justify-center"
                >
                  <span class="title font-weight-light">Set Timezone</span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-3">
                    <v-combobox
                      v-model="timezone"
                      :items="timezones"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="primary"
                    @click="saveTimezone()"
                  >Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NewPassword',

  data () {
    return {
      err: false,
      errMsgs: [],
      color: 'primary',
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      show1: false,
      show2: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        match: () =>
          this.newPassword === this.newPasswordConfirm ||
          'Passwords must match'
      },
      timezone: '',
      timezones: []
    }
  },

  computed: {
    ...mapGetters({
      initialPassword: 'initialPassword',
      initialTimezone: 'initialTimezone'
    }),
    e () {
      if (this.initialPassword) return 1
      return 2
    }
  },

  methods: {
    ...mapActions({
      // snackbar
      activate: 'global/snackbar/activate',
      changePassword: 'user2/changePassword',
      changeTimezone: 'user2/changeTimezone',
      getTimezoneMeta: 'user2/getTimezoneMeta',
      initialize: 'setInitialAttributeState',
      init: '_initialize'
    }),
    savePassword () {
      this.changePassword(
        {
          'oldPassword': this.oldPassword,
          'newPassword': this.newPassword,
          'newPasswordConfirm': this.newPasswordConfirm
        }
      )
        .then(resp => {
          this.getTimezoneMeta()
            .then(resp => {
              this.timezones = resp.data.post.value.lookup.data
            })
          this.initialize({ 'initialPassword': false, 'initialTimezone': this.initialTimezone })
          if (!this.initialTimezone) this.init()
        })
        .catch(err => {
          this.err = true
          this.errMsgs = err.response.data
          this.activate({ color: 'error', message: err.response.data[0] })
        })
    },
    saveTimezone () {
      if (this.timezone) {
        this.changeTimezone(this.timezone)
          .then(resp => {
            this.init()
          })
      }
    }
  },

  mounted () {
    // ajax call is only allowed for users with initialPassword: true
    if (!this.initialTimezone) {
      this.getTimezoneMeta()
        .then(resp => {
          this.timezones = resp.data.post.value.lookup.data
        })
    }
  }
}
</script>
