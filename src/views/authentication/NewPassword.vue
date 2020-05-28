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
                      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="showPassword ? 'text' : 'password'"
                      name="oldPassword"
                      label="Old Password"
                      :error="('password' in errMsgs)"
                      :error-messages="errMsgs.password"
                      @click:append="showPassword = !showPassword"
                      @keyup.enter="savePassword()"
                    />
                    <v-text-field
                      id="newPassword"
                      v-model="newPassword"
                      prepend-icon="lock"
                      :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="showNewPassword ? 'text' : 'password'"
                      name="newPassword"
                      label="New Password"
                      :error="('password_new' in errMsgs)"
                      :error-messages="errMsgs.password_new"
                      @click:append="showNewPassword = !showNewPassword"
                      @keyup.enter="savePassword()"
                    />
                    <v-text-field
                      id="confirm"
                      v-model="newPasswordConfirm"
                      prepend-icon="lock"
                      :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min, rules.match]"
                      :type="showNewPassword ? 'text' : 'password'"
                      name="confirm"
                      label="Confirm New Password"
                      :error="('password_new_verification' in errMsgs)"
                      :error-messages="errMsgs.password_new_verification"
                      @click:append="showNewPassword = !showNewPassword"
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
      errMsgs: [],
      color: 'primary',
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      showPassword: false,
      showNewPassword: false,
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
          this.errMsgs = err.response.data
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
