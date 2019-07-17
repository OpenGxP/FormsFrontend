<template>
    <v-select
        v-model="checkedContent"
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
        ref="test"
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
    props: ['value', 'items', 'label', 'hint', 'required', 'editable', 'multiple']
    
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
        },
        checkedContent () {
            console.log('items', this.content)
            console.log(typeof this.content)
            if (typeof this.content === 'string') {
                if(this.content.indexOf(',') === -1) {
                    return [this.itecontentms]
                }
                return this.content.split(',')
            }
            return this.content
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
