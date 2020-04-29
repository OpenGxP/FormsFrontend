<template>
  <v-text-field
    v-model="val"
    dense
    :hint="cHint"
    :required="required"
    :disabled="!editable"
    :autofocus="autofocus"
    :error="error"
    :error-messages="errormsgs"
    clearable
    @input="handleInput"
    @keydown.enter="save()"
  >
    <template v-slot:label>
      <div>
        {{label}}<span v-if="required" class="red--text">*</span>
      </div>
    </template>
  </v-text-field>
</template>

<script>
import input from '@/mixins/input'

export default {
  props: {
    value: {
      default: '',
      required: true,
      type: String
    }
  },

  // use data to avoid mutating the prop
  data () {
    return {
      val: this.value
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
    }
  },

  // push changes to parent
  methods: {
    handleInput (e) {
      this.$emit('input', this.val)
    },
    save () {
      this.$emit('enter-event')
    }
  }
}
</script>

<style>

</style>
