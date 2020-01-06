<template>
  <v-container>
    <v-card>
      <v-card-title>Question 1</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <v-textarea
              v-model="question_one"
              clearable
              label="Question 1"
              auto-grow
              rows="1"
              solo
              :background-color="editable ? 'grey' : null"
              :disabled="!editable"
            />
            <v-textarea
              v-model="answer_one"
              clearable
              label="Answer 1"
              auto-grow
              rows="1"
              solo
              :background-color="editable ? 'grey' : null"
              :disabled="!editable"
            />
            <v-textarea
              v-model="question_two"
              clearable
              label="Question 2"
              auto-grow
              rows="1"
              solo
              :background-color="editable ? 'grey' : null"
              :disabled="!editable"
            />
            <v-textarea
              v-model="answer_two"
              clearable
              label="Answer 2"
              auto-grow
              rows="1"
              solo
              :background-color="editable ? 'grey' : null"
              :disabled="!editable"
            />
            <v-textarea
              v-model="question_three"
              clearable
              label="Question 3"
              auto-grow
              rows="1"
              solo
              :background-color="editable ? 'grey' : null"
              :disabled="!editable"
            />
            <v-textarea
              v-model="answer_three"
              clearable
              label="Answer 3"
              auto-grow
              rows="1"
              solo
              :background-color="editable ? 'grey' : null"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="8">
            
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn color="primary" @click="dialog2 = true">Save</v-btn>

            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title class="headline" primary-title>Password</v-card-title>

                <v-card-text>
                  <v-text-field
                    v-model="password"
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'visibility' : 'visibility_off'"
                    label="Password"
                    @click:append="show = !show"
                    @keyup.enter="changeQuestions"
                  />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" text @click="dialog=false">Cancel</v-btn>
                  <v-btn color="primary" text @click="changeQuestions">Confirm</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialog2" width="500">
              <v-card>
                <v-card-title class="headline" primary-title>Input Confirmation</v-card-title>

                <v-card-text>
                  <p>Are you sure you want to reset your security questions?</p>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" text @click="dialog2=false">Cancel</v-btn>
                  <v-btn color="primary" text @click="est()">Confirm</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-btn absolute fab bottom right color="primary" @click="editable = !editable">
      <v-icon v-text="editable ? 'clear' : 'edit'" />
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      question_one: "",
      answer_one: "",
      question_two: "",
      answer_two: "",
      question_three: "",
      answer_three: "",
      passwordDialog: false,
      dialog: false,
      dialog2: false,
      password: "",
      show: false,
      editable: false
    };
  },

  methods: {
    ...mapActions({
      // snackbar
      activate: "snackbar/activate"
    }),
    est() {
      this.dialog2 = false;
      this.dialog = true;
    },
    changeQuestionsRequest() {
      this.dialog = true;
    },
    changeQuestions() {
      this.dialog = false;
      this.$http
        .patch("user/change_questions", {
          question_one: this.question_one,
          question_two: this.question_two,
          question_three: this.question_three,
          answer_one: this.answer_one,
          answer_two: this.answer_two,
          answer_three: this.answer_three,
          password: this.password
        })
        .then(resp => {
          this.answer_one = "";
          this.answer_two = "";
          this.answer_three = "";
          this.activate({ color: "success", message: resp.data });
        })
        .catch(err => {
          this.activate({ color: "error", message: err.response.data });
        });
    }
  },

  watch: {
    dialog2(val) {
      if (!val) this.password = "";
    }
  },

  created() {
    this.$http.get("user/profile_questions").then(resp => {
      this.question_one = resp.data.question_one;
      this.question_two = resp.data.question_two;
      this.question_three = resp.data.question_three;
    });
  }
};
</script>

<style>
</style>
