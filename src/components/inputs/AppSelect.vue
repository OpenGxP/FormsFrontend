<template>
  <v-select
    v-model="content"
    :items="items"
    :search-input.sync="search"
    hide-selected
    :hint="hint"
    :required="required"
    :disabled="!editable"
    :label="fieldLabel"
    :multiple="multiple"
    persistent-hint
    small-chips
    @input="handleInput"
  >
    <template v-slot:no-data>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            No results matching "<strong>{{ search }}</strong>".
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-select>
</template>

<script>
export default {
  props: ['value', 'items', 'label', 'hint', 'required', 'editable', 'multiple'],

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
    },
    checkedContent () {
      if (typeof this.content === 'string') {
        if (this.content.indexOf(',') === -1) {
          return [this.itecontentms]
        }
        return this.content.split(',')
      }
      return this.content
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
