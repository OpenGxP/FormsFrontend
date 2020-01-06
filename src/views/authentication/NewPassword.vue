<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8 lg4>
        <v-card class="elevation-12">
          <v-card-title primary-title class="justify-center">
            <span class="title font-weight-light">New Password</span>
          </v-card-title>
          <v-card-text>
            <v-form class="px-3">
              <v-text-field
                id="oldPassword"
                v-model="password"
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
            <v-btn color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "NewPassword",

  props: {
    dialogName: {
      type: String,
      default: "New Password"
    }
  },

  data() {
    return {
      err: false,
      errMsgs: [],
      color: "primary",
      password: "",
      password_new: "",
      password_new_verification: "",
      show1: false,
      show2: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        match: () =>
          this.password_new === this.password_new_verification ||
          "Passwords must match"
      }
    };
  },

  methods: {
    ...mapActions({
      // snackbar
      activate: "global/snackbar/activate"
    }),
    save() {
      const password = this.password;
      const password_new = this.password_new;
      const password_new_verification = this.password_new_verification;
      axios({
        method: "patch",
        url: "/user/change_password",
        data: { password, password_new, password_new_verification },
        withCredentials: true
      })
        .then(resp => {
          if (resp.status === 200) {
            this.$store.dispatch("initialize");
            this.$store.dispatch("get");
            this.$store.commit("login");
            this.$router.push("/");
          }
        })
        .catch(err => {
          this.err = true
          this.errMsgs = err.response.data
          this.activate({ color: "error", message: err.response.data[0] });
        });
    }
  }
};
</script>
