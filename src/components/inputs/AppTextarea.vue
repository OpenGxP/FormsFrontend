<template>
  <v-textarea
    v-model="val"
    :hint="cHint"
    :required="required"
    :counter="counter"
    :maxlength="maxlength"
    :disabled="!editable"
    :autofocus="autofocus"
    :error="err.error"
    :error-messages="err.msgs"
    :success="success"
    :append-outer-icon="success ? 'check_circle_outline' : ''"
    auto-grow
    clearable
    error-count="10"
    rows="1"
    @input="handleInput"
    @keydown.enter="save()"
    @blur="validate()"
  >
    <template v-slot:label>
      <div>
        {{label}}<span
          v-if="required"
          class="red--text"
        >*</span>
      </div>
    </template>
  </v-textarea>
</template>

<script>
import input from '@/mixins/input'

export default {
  props: {
    value: {
      default: '',
      required: true,
      type: String
    },
    validationField: {
      type: String,
      required: false,
      default: ''
    },
    success: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  // use data to avoid mutating the prop
  data () {
    return {
      val: this.value,
      err: {
        error: false,
        msgs: []
      }
    }
  },

  // mixin for input components
  mixins: [
    input
  ],

  // sync changes from parent
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.val = newVal
      }
    },
    error (val) {
      this.err.error = val
    },
    errormsgs (val) {
      this.err.msgs = val
    }
  },

  // push changes to parent
  methods: {
    handleInput (e) {
      this.$emit('input', this.val)
    },
    save () {
      this.$emit('enter-event')
    },
    validate () {
      if (this.validationField) {
        this.$http.get(`/validate/${this.validationField}/${this.val}`)
          .then(resp => {
            // no error
            this.err.error = false
            this.err.msgs = []
          })
          .catch(err => {
            this.err.error = true
            this.err.msgs = err.response.data[this.validationField]
          })
      }
    }
  }
}
</script>

<style>
</style>
