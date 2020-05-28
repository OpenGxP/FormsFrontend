<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card
        v-if="dialog"
        class="elevation-12"
      >
        <v-card-title>
          <span class="headline">{{ dialogName }}</span>
          <v-spacer />
          <v-btn
            icon
            @click="closeDialog()"
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-textarea
              v-if="com !== 'none'"
              :autofocus="com != 'none'"
              id="Comment"
              v-model="comment"
              prepend-icon="comment"
              name="Comment"
              :label="labelComment"
              :error="!!errMsgs.comment.length"
              :error-messages="errMsgs.comment"
              clearable
              @keyup.enter="setSignature()"
            />
            <v-text-field
              v-if="sig != 'logging'"
              v-model="username"
              :autofocus="com === 'none'"
              prepend-icon="person"
              name="login"
              :label="labelUsername"
              type="text"
              :error="!!errMsgs.sig_user.length"
              :error-messages="errMsgs.sig_user"
              clearable
              @keyup.enter="setSignature()"
            />
            <v-text-field
              v-if="sig != 'logging'"
              id="Password"
              v-model="password"
              prepend-icon="lock"
              :append-icon="show1 ? 'visibility_off' : 'visibility'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="Password"
              :label="labelPassword"
              :error="!!errMsgs.sig_pw.length"
              :error-messages="errMsgs.sig_pw"
              clearable
              @click:append="show1 = !show1"
              @keyup.enter="setSignature()"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="closeDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="setSignature()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Signature',

  props: {
    dialog: {
      type: Boolean,
      default: true
    },
    // type of comment: none || optional || mandatory
    com: {
      type: String,
      default: 'optional'
    },
    // type of signature: logging || signature
    sig: {
      type: String,
      default: 'signature'
    },
    error: {
      type: Object,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      dialogName: 'Signature',
      err: false,
      errMsgs: {
        comment: [],
        sig_user: [],
        sig_pw: []
      },
      defaultErrMsgs: {
        comment: [],
        sig_user: [],
        sig_pw: []
      },
      color: 'primary',
      username: '',
      password: '',
      comment: '',
      show1: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters'
      }
    }
  },

  computed: {
    labelComment () {
      if (this.com === 'mandatory') return 'Comment*'
      return 'Comment'
    },
    labelUsername () {
      if (this.sig === 'signature') return 'Username*'
      return 'Username'
    },
    labelPassword () {
      if (this.sig === 'signature') return 'Password*'
      return 'Password'
    }
  },

  watch: {
    // restest data of component when closed
    dialog: {
      handler () {
        this.username = this.comment = this.password = ''
        this.errMsgs = _.cloneDeep(this.defaultErrMsgs)
      },
      deep: true,
      immediate: true
    },
    error: {
      deep: true,
      imidiate: true,
      handler (val) {
        if (!_.isEmpty(val)) {
          this.handleErrors(val)
        }
      }
    }
  },

  methods: {
    // push data to parent
    setSignature () {
      let payload = {}
      if (this.com !== 'none') payload = Object.assign(payload, { com: this.comment })
      if (this.sig !== 'logging') payload = Object.assign(payload, { sig_user: this.username, sig_pw: this.password })
      this.$emit('get-signature', payload)
    },
    // push close to parent
    closeDialog () {
      this.$emit('close-dialog', false)
    },
    handleErrors (errors) {
      if (!Object.keys(errors).includes('comment')) this.errMsgs.comment = []
      if (!Object.keys(errors).includes('sig_user')) this.errMsgs.comment = []
      if (!Object.keys(errors).includes('sig_pw')) this.errMsgs.comment = []
      this.errMsgs = { ...this.errMsgs, ...errors }
    }
  }
}
</script>
