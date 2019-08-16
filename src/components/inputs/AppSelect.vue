<template>
  <v-select
    v-model="content"
    :items="items"
    :hint="hint"
    :required="required"
    :disabled="!editable"
    :label="fieldLabel"
    :multiple="multiple"
    persistent-hint
    small-chips
    :error="error"
    :error-messages="errormsgs"
    @input="handleInput"
  >

    <!-- slot to display custom value for multi selection -->
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ item }}</span>
      </v-chip>
      <span
        v-if="index === 1"
        class="grey--text caption"
      >(+{{ value.length - 1 }} others)</span>
    </template>

    <!-- slot for select all option -->
    <template v-slot:prepend-item v-if="multiple === true">
      <v-list-item
        ripple
        @click="toggle"
      >
        <v-list-item-action>
          <v-icon :color="content.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Select All</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>

  </v-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Array]
    },
    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    label: {
      type: String
    },
    hint: {
      type: String
    },
    required: {
      type: Boolean
    },
    editable: {
      type: Boolean
    },
    multiple: {
      type: Boolean
    },
    error: {
      type: Boolean
    },
    errormsgs: {
      type: [String, Array]
    }
  },

  data () {
    return {
      content: this.value
    }
  },

  computed: {
    fieldLabel () {
      if (this.required) return `${this.label}*`
      return this.label
    },
    allItems () {
      return this.content.length === this.items.length
    },
    someItems () {
      return this.content.length > 0 && !this.allItems
    },
    icon () {
      if (this.allItems) return 'check_box'
      if (this.someItems) return 'indeterminate_check_box'
      return 'check_box_outline_blank'
    }
  },

  methods: {
    handleInput (e) {
      this.$emit('input', this.content)
    },
    toggle () {
      if (this.allItems) {
        this.content = []
        this.$emit('input', this.content)
      } else {
        this.content = this.items.slice()
        this.$emit('input', this.content)
      }
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
