<template>
  <v-combobox
    v-model="content"
    dense
    :items="items"
    :search-input.sync="search"
    hide-selected
    :hint="hint"
    :required="required"
    :readonly="!editable"
    :multiple="multiple"
    :autofocus="autofocus"
    :success="success"
    :append-outer-icon="success ? 'check_circle_outline' : ''"
    persistent-hint
    small-chips
    :error="error"
    :error-messages="errormsgs"
    error-count="10"
    @input="handleInput"
  >
    <!-- slot: label -->
    <template v-slot:label>
      <div>
        {{label}}<span v-if="required" class="red--text">*</span>
      </div>
    </template>
    <!-- slot: no data -->
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
import input from '@/mixins/input'

export default {
  props: {
    value: {
      required: true
    },
    items: {
      required: false,
      type: [Array, String]
    },
    multiple: {
      default: false,
      required: false,
      type: Boolean
    },
    success: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      content: this.value,
      search: null
    }
  },

  // mixin for input components
  mixins: [
    input
  ],

  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.content = newVal
      }
    }
  },

  methods: {
    handleInput (e) {
      this.$emit('input', this.content)
    }
  }
}
</script>

<style>
</style>
