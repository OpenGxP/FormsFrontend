<template>
  <v-container>
    <v-card>
      <v-card-title>General</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>Username</v-col>
          <v-col>{{info}}</v-col>
        </v-row>

        <v-row>
          <v-col>Dark Mode</v-col>
          <v-col>
            <v-switch v-model="dark" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>Timezone</v-col>
          <v-col>
            <v-dialog v-model="dia" width="500">
              <template v-slot:activator="{ on }">
                <v-btn dark color="primary" v-on="on">Set timezone</v-btn>
              </template>
              <v-card>
                <v-card-title primary-title class="justify-center">
                  <span class="title font-weight-light">Set Timezone</span>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-3">
                    <v-combobox v-model="ct" :items="timezones" />
                  </v-form>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn color="primary" @click="dia = false">Cancel</v-btn>
                  <v-btn color="primary" @click="ss">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>

        <v-row>
          <v-col>Reset Password</v-col>
          <v-col>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn dark color="primary" v-on="on">Reset Password</v-btn>
              </template>

              <v-card class="elevation-12">
                <v-card-title primary-title class="justify-center">
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
                  <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
                  <v-btn color="primary" @click="save">Save</v-btn>
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
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      ct: "",
      timezone: "",
      timezones: [],
      myval: "",
      items: [],
      dialog: false,
      dia: false,
      info: "",
      err: false,
      errMsgs: [],
      password: "",
      password_new: "",
      password_new_verification: "",
      show1: false,
      show2: false,
      dark: this.$vuetify.theme.dark,
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
      activate: "snackbar/activate"
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
          this.dialog = false;
          this.activate({
            color: "success",
            message: "password was successfully reset"
          });
        })
        .catch(err => {
          this.errMsgs = err.response.data;
          this.err = true;
          this.activate({ color: "error", message: this.errMsgs });
        });
    },
    edit() {
      const key = "gui.dense";
      const payload = { value: "Yes" };
      this.$http.patch(`user/profile/${key}`, payload);
    },
    ss() {
      if (this.ct) {
        this.timezone = this.ct;
        this.$http.patch("user/profile/loc.timezone", { value: this.timezone });
      }
      this.dia = false;
    }
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.password = "";
        this.password_new = "";
        this.password_new_verification = "";
      }
    },
    dark(val) {
      this.$vuetify.theme.dark = val;
      // this.$vuetify.theme.themes.dark.primary = '#4caf50'
    },
    items: {
      immediate: true,
      handler(val) {
        if (this.itmes) {
          let timezone = this.items.find(obj => obj.key === "loc.timezone");
          this.timezone = timezone.value;
        }
      }
    }
  },

  mounted() {
    this.info = this.$store.getters.currentUser;
    this.$http.get("user/profile").then(resp => {
      this.items = resp.data;
    });
    this.$http.get("meta/set_timezone").then(resp => {
      this.timezones = resp.data.post.value.lookup.data;
    });
  }
};
</script>

<style>
</style>
