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
            <span class="title font-weight-light">Reset Password</span>
          </v-card-title>

          <v-card-text>
            <v-layout justify-center>
              <v-flex xs12>
                <div class="headline">
                  Question 1
                </div>
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-flex
                xs12
                md12
              >
                <v-textarea
                  v-model="questionOne"
                  clearable
                  label="Question 1"
                  auto-grow
                  rows="1"
                  box
                />
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-flex
                xs12
                md12
              >
                <v-text-field
                  v-model="answer_one"
                  clearable
                  label="Answer 1"
                  box
                  prepend-inner-icon="lock"
                  :append-icon="showa1 ? 'visibility_off' : 'visibility'"
                  :type="showa1 ? 'text' : 'password'"
                  @click:append="showa1 = !showa1"
                />
              </v-flex>
            </v-layout>

            <v-layout justify-center>
              <v-flex xs12>
                <div class="headline">
                  Question 2
                </div>
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-flex
                xs12
                md12
              >
                <v-textarea
                  v-model="question_two"
                  clearable
                  label="Question 2"
                  auto-grow
                  rows="1"
                  box
                />
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-flex
                xs12
                md12
              >
                <v-text-field
                  v-model="answer_two"
                  clearable
                  label="Answer 2"
                  box
                  prepend-inner-icon="lock"
                  :append-icon="showa2 ? 'visibility_off' : 'visibility'"
                  :type="showa2 ? 'text' : 'password'"
                  @click:append="showa2 = !showa2"
                />
              </v-flex>
            </v-layout>

            <v-layout justify-center>
              <v-flex xs12>
                <div class="headline">
                  Question 3
                </div>
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-flex
                xs12
                md12
              >
                <v-textarea
                  v-model="question_three"
                  clearable
                  label="Question 3"
                  auto-grow
                  rows="1"
                  box
                />
              </v-flex>
            </v-layout>
            <v-layout justify-center>
              <v-flex
                xs12
                md12
              >
                <v-text-field
                  v-model="answer_three"
                  clearable
                  label="Answer 3"
                  box
                  prepend-inner-icon="lock"
                  :append-icon="showa3 ? 'visibility_off' : 'visibility'"
                  :type="showa3 ? 'text' : 'password'"
                  @click:append="showa3 = !showa3"
                />
              </v-flex>
            </v-layout>

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
              @keyup.enter="resetPassword()"
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
              @keyup.enter="resetPassword()"
            />
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn
              color="primary"
              @click="resetPassword()"
            >
              Reset Password
            </v-btn>
          </v-card-actions>

          <p
            class="text-xs-center"
            style="padding: 2em 0px"
          >
            <router-link
              style="text-decoration: none;"
              to="/login"
            >
              Return to login
            </router-link>
          </p>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      token: '',
      err: false,
      errMsgs: [],
      questionOne: '',
      answer_one: '',
      question_two: '',
      answer_two: '',
      question_three: '',
      answer_three: '',
      password_new: '',
      password_new_verification: '',
      show1: false,
      show2: false,
      showa1: false,
      showa2: false,
      showa3: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        match: () => (this.password_new === this.password_new_verification) || 'Passwords must match'
      }
    }
  },

  mounted () {
    this.token = this.$route.params['token']
    axios.get(this.$route.path)
      .then(resp => {
        this.questionOne = resp.data.question_one
        this.question_two = resp.data.question_two
        this.question_three = resp.data.question_three
      })
      /*
      .catch(err => {
        // TO DO
      })
      */
  },

  methods: {
    resetPassword () {
      axios.post(this.$route.path, {
        answer_one: this.questionOne,
        answer_two: this.answer_two,
        answer_three: this.answer_three,
        password_new: this.password_new,
        password_new_verification: this.password_new_verification
      })
        .then(resp => {
          this.$router.push('/login')
        })
        /*
        .catch(err => {
          // TO DO
        })
        */
    }
  }
}
</script>

<style>
</style>
