<template>
    <v-text-field
        v-model="val"
        @input="handleInput"
        :label="fieldLabel"
        :hint="hint"
        :required="required"
        :disabled="!editable"
        :type="show ? 'text' : 'password'"
        :append-icon="show ? 'visibility' : 'visibility_off'"
        @click:append="show = !show"
        clearable
    ></v-text-field>
</template>

<script>
export default {
  props: ['value', 'hint', 'label', 'required', 'editable'],

  // use data to avoid mutating the prop
  data () {
    return {
      val: this.value,
      show: false
    }
  },

  // push changes to parent
  methods: {
    handleInput (e) {
      this.$emit('input', this.val)
    }
  },

  computed: {
    fieldLabel () {
      if (this.required) return `${this.label}*`
      return this.label
    }
  },

  // sync changes from parent
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.val = newVal
      }
    }
  }
}
</script>

<style>

</style>
