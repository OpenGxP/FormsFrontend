<template>
    <v-container>
        <v-layout row>
					<v-flex xs12 sm6 offset-sm3>
						<v-list two-line subheader>
							<v-subheader>General</v-subheader>

							<v-list-tile avatar>
								<v-list-tile-content>
									<v-list-tile-title>Username</v-list-tile-title>
									<v-list-tile-sub-title>{{info}}</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>

							<v-list-tile avatar>
								<v-list-tile-content>
									<v-list-tile-title>Status</v-list-tile-title>
									<v-list-tile-sub-title>Online</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
							
						</v-list>
					</v-flex>
				</v-layout>
				
				<v-dialog
          v-model="dialog"
          width="500"
        >
        <template v-slot:activator="{ on }">
          <v-btn
            color="red lighten-2"
            dark
            v-on="on"
          >
            Reset Password
          </v-btn>
        </template>

        <v-card class="elevation-12">
          <v-card-title primary-title class="justify-center">
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
            <v-btn @click="dialog = false" color="primary">Cancel</v-btn>
            <v-btn @click="save" color="primary">Save</v-btn> 
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'

export default {
	data () {
		return {
			dialog: false,
			info: '',
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
				match: () => (this.password_new === this.password_new_verification) || 'Passwords must match'
			}
		}
	},

	methods: {
    ...mapActions(
      {
        show: 'show',
        setOptions: 'setOptions'
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
          this.setOptions({color: 'success', message: 'password was successfully reset'})
          this.show()
        })
        .catch(err => {
          this.errMsgs = err.response.data
          this.err = true
          this.setOptions({color: 'error', message: this.errMsgs})
          this.show()
        })
    }
  },
  
	mounted () {
		this.info = this.$store.getters.currentUser
	}
}
</script>


<style>

</style>
