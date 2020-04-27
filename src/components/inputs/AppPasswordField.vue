<template>
  <v-text-field
    v-model="val"
    dense
    :hint="cHint"
    :required="required"
    :disabled="!editable"
    :autofocus="autofocus"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'visibility' : 'visibility_off'"
    :error="error"
    :error-messages="errormsgs"
    clearable
    @input="handleInput"
    @click:append="show = !show"
  >
    <!-- slot: label -->
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
      required: true
    }
  },

  // use data to avoid mutating the prop
  data () {
    return {
      val: this.value,
      show: false
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
    }
  }
}
</script>

<style>

</style>
