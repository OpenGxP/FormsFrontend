<template>
  <v-combobox
    v-model="content"
    :items="items"
    :search-input.sync="search"
    hide-selected
    :hint="hint"
    :required="required"
    :readonly="!editable"
    :label="fieldLabel"
    :multiple="multiple"
    :autofocus="autofocus"
    persistent-hint
    small-chips
    :error="error"
    :error-messages="errormsgs"
    @input="handleInput"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            No results matching "<strong>{{ search }}</strong>".
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
export default {
  props: ['value', 'items', 'label', 'hint', 'required', 'editable', 'multiple', 'autofocus', 'error', 'errormsgs'],

  data () {
    return {
      content: this.value,
      search: null
    }
  },

  computed: {
    fieldLabel () {
      if (this.required) return `${this.label}*`
      return this.label
    }
  },

  methods: {
    handleInput (e) {
      this.$emit('input', this.content)
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.content = newVal
      }
    }
  }
}
</script>

<style>
</style>
