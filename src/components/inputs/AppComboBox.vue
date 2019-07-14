<template>
    <v-combobox
        v-model="content"
        :items="items"
        :search-input.sync="search"
        hide-selected
        :hint="hint"
        :required="required"
        :disabled="!editable"
        :label="fieldLabel"
        multiple
        persistent-hint
        small-chips
        @input="handleInput"
        ref="test"
  >
    <template v-slot:no-data>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-combobox>
</template>

<script>
export default {
    props: ['value', 'items', 'label', 'hint', 'editable']
    
    /*{
        items: {
            type: Array
        },
        value: {
            type: Array
        },
        label: {
            type: String
        }
    }*/
    ,

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
        sync () {
            // this.$emit('input', this.value)
            this.$emit('string-value', this.stringValue)
        },
        handleInput (e) {
            this.$emit('input', this.content)
        }
    },

    watch: {
        value: {
            immediate: true,
            handler(newVal) {
                this.content = newVal;
            }
        }
    },

    destoyed () {
        console.log('combobox destroyed')
    }
}
</script>

<style>

</style>
