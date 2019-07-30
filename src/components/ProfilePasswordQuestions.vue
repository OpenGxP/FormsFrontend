<template>
  <v-container>

    <v-layout justify-center>
      <v-flex xs6>
        <div class="headline pb-2">Question 1</div>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex
        xs12
        md6
      >
        <v-textarea
          v-model="question_one"
          clearable
          label="Question 1"
          auto-grow
          rows="1"
          solo
        >
        </v-textarea>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex
        xs12
        md6
      >
        <v-textarea
          v-model="answer_one"
          clearable
          label="Answer 1"
          auto-grow
          rows="1"
          solo
        >
        </v-textarea>
      </v-flex>
    </v-layout>

    <v-layout justify-center>
      <v-flex xs6>
        <div class="headline pb-2">Question 2</div>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex
        xs12
        md6
      >
        <v-textarea
          v-model="question_two"
          clearable
          label="Question 2"
          auto-grow
          rows="1"
          solo
        >
        </v-textarea>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex
        xs12
        md6
      >
        <v-textarea
          v-model="answer_two"
          clearable
          label="Answer 2"
          auto-grow
          rows="1"
          solo
        >
        </v-textarea>
      </v-flex>
    </v-layout>

    <v-layout justify-center>
      <v-flex xs6>
        <div class="headline pb-2">Question 3</div>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex
        xs12
        md6
      >
        <v-textarea
          v-model="question_three"
          clearable
          label="Question 3"
          auto-grow
          rows="1"
          solo
        >
        </v-textarea>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex
        xs12
        md6
      >
        <v-textarea
          v-model="answer_three"
          clearable
          label="Answer 3"
          auto-grow
          rows="1"
          solo
        >
        </v-textarea>
      </v-flex>
    </v-layout>

    <v-layout justify-center>
      <v-btn
        @click="dialog2 = true"
        color="orange"
      >Save</v-btn>

      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline"
            primary-title
          >Password
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="password"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'visibility' : 'visibility_off'"
              label="Password"
              @click:append="show = !show"
            >
            </v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog=false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="changeQuestions"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog2"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline"
            primary-title
          >Input Confirmation
          </v-card-title>

          <v-card-text>
            <p>Are you sure you want to reset your security questions?</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog2=false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="est()"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      question_one: '',
      answer_one: '',
      question_two: '',
      answer_two: '',
      question_three: '',
      answer_three: '',
      passwordDialog: false,
      dialog: false,
      dialog2: false,
      password: '',
      show: false
    }
  },

  methods: {
    ...mapActions({
      // snackbar
      activate: 'snackbar/activate'
    }),
    est () {
      this.dialog2 = false
      this.dialog = true
    },
    changeQuestionsRequest () {
      this.dialog = true
    },
    changeQuestions () {
      this.dialog = false
      this.$http.patch('user/change_questions', {
        question_one: this.question_one,
        question_two: this.question_two,
        question_three: this.question_three,
        answer_one: this.answer_one,
        answer_two: this.answer_two,
        answer_three: this.answer_three,
        password: this.password
      })
        .then(resp => {
          this.answer_one = ''
          this.answer_two = ''
          this.answer_three = ''
          this.activate({ color: 'success', message: resp.data })
        })
        .catch(err => {
          this.activate({ color: 'error', message: err.response.data })
        })
    }
  },

  created () {
    this.$http.get('user/profile')
      .then(resp => {
        this.question_one = resp.data.question_one
        this.question_two = resp.data.question_two
        this.question_three = resp.data.question_three
      })
  },

  watch: {
    dialog2 (val) {
      if (!val) this.password = ''
    }
  }
}
</script>

<style>
</style>
