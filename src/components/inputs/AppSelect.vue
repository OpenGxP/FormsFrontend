<template>
  <v-autocomplete
    v-model="content"
    :items="items"
    :hint="hint"
    :required="required"
    :disabled="!editable"
    :multiple="multiple"
    :error="error"
    :error-messages="errormsgs"
    :success="success"
    :append-outer-icon="success ? 'check_circle_outline' : ''"
    error-count="10"
    persistent-hint
    :clearable="multiple ? true : false"
    small-chips
    @input="handleInput"
    click:clear="reset"
  >
    <!-- slot: label -->
    <template v-slot:label>
      <div>
        {{label}}<span v-if="required" class="red--text">*</span>
      </div>
    </template>

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

    <!-- slot for selection of all options -->
    <template
      v-if="multiple === true"
      v-slot:prepend-item
    >
      <v-list-item
        ripple
        @click="toggle"
      >
        <v-list-item-action>
          <v-icon :color="content.length > 0 ? 'primary' : ''">
            {{ icon }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Select All</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
  </v-autocomplete>
</template>

<script>
import input from '@/mixins/input'

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
    multiple: {
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
      content: this.value
    }
  },

  // mixin for input components
  mixins: [
    input
  ],

  computed: {
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

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler (newVal) {
        this.content = newVal
      }
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
    },
    reset () {
      this.content = this.multiple ? [] : ''
    }
  }
}
</script>

<style>
</style>
