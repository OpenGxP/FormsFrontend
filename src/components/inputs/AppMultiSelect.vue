<template>
  <v-select
    ref="test"
    v-model="value"
    :items="items"
    :label="label"
    multiple
    @input="sync"
  >
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ item }}</span>
      </v-chip>
      <span
        v-if="index === 1"
        class="grey--text caption"
      >(+{{ value.length - 1 }} others)</span>
    </template>
  </v-select>
</template>

<script>
export default {
  name: '',
  props: {
    items: {
      type: Array,
      default () {
        return {
          val: []
        }
      }
    },
    /*
        value: {
            type: Array,
            default: []
        },
        */
    label: {
      type: String
    }
  },
  data () {
    return {
      value: []
    }
  },
  computed: {
    stringValue () {
      return this.value ? this.value.toString() : ''
    }
  },
  methods: {
    sync () {
      // this.$emit('input', this.value)
      this.$emit('string-value', this.stringValue)
    }
  }
}
</script>

<style>
</style>
