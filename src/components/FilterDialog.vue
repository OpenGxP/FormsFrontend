<template>
  <v-dialog
    v-model="dialog"
    width="800"
    @click:outside="close()"
  >
    <v-card>
      <!-- title -->
      <v-card-title>
        <span class="headline">Filter</span>
        <v-spacer />
        <v-btn
          icon
          @click="close()"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-card-title>

      <!-- body -->
      <v-card-text>
        <v-container>
          <v-row
            v-for="(filter, index) in filters.filter"
            :key="index"
          >
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row
                    v-for="(condition, i) in filter.children"
                    :key="i"
                    class="mx-2"
                    align="center"
                    justify="center"
                  >
                    <v-col cols="4">
                      <v-combobox
                        v-if="i === 0"
                        v-model="filter.field"
                        :items="usableFields"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="condition.operator"
                        :items="operators"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="condition.value"
                        append-outer-icon="cancel"
                        @keyup.enter="save(false)"
                        @click:append-outer="removeChild(index, i)"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-radio-group
                    class="ml-2"
                    v-model="filter.chain"
                    row
                    :mandatory="true"
                  >
                    <v-radio
                      label="AND"
                      value="and"
                    />
                    <v-radio
                      label="OR"
                      value="or"
                    />
                  </v-radio-group>
                  <div class="flex-grow-1" />
                  <v-btn
                    text
                    @click="addChild(index)"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="auto"
              class="mr-auto"
            >
              <v-radio-group
                class="ml-4"
                v-model="filters.condition"
                row
                :mandatory="true"
              >
                <v-radio
                  label="AND"
                  value="and"
                />
                <v-radio
                  label="OR"
                  value="or"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="auto">
              <v-btn
                text
                :disabled="filters.filter.length === fields.length"
                @click="addFilter()"
              >
                Add
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="blue darken-1"
          text
          @click="reset()"
        >
          Reset
        </v-btn>
        <div class="flex-grow-1" />
        <v-btn
          color="blue darken-1"
          text
          @click="close()"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save(false)"
          :disabled="!allConditionsFilled"
        >
          Apply
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save()"
          :disabled="!allConditionsFilled"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

  props: {
    fields: {
      type: Array,
      default: function () {
        return ['one', 'two', 'three', 'four', 'five']
      }
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      filters: {
        condition: 'and',
        filter: [
          {
            id: '',
            sequence: 1,
            field: '',
            chain: 'and',
            children: [
              {
                id: '',
                sequence: 1,
                operator: '',
                value: ''
              }
            ]
          }
        ]
      },
      defaultFilter: {
        id: '',
        sequence: 1,
        field: '',
        children: [
          {
            id: '',
            sequence: 1,
            operator: '',
            value: ''
          }
        ]
      },
      operators: ['contains', 'exact', 'startswith', 'endswith']
    }
  },

  computed: {
    usableFields () {
      const usedFields = this.filters.filter.map(x => x.field)
      return this.fields.filter(x => !(usedFields.includes(x)))
    },
    allConditionsFilled () {
      // returns true if if all condition fields are filled
      for (let filter of this.filters.filter) {
        for (let child of filter.children) {
          if (child.value == '') return false
        }
      }
      return true
    }
  },

  watch: {
    // watch state and apply val for empty filter
    dialog: {
      handler (val) {
        if (val && this.filters.filter[0].field === '') {
          this.filters.filter[0].field = this.fields[0]
          this.filters.filter[0].children[0].operator = this.operators[0]
        }
      },
      deep: true,
      immidiate: true
    }
  },

  methods: {
    close () {
      // semit event to parent to close dialog via according prop
      this.$emit('close-dialog', false)
    },
    save (close = true) {
      // emit query string and depending on argument close dialog or not
      let url = ''
      for (const [i, filter] of this.filters.filter.entries()) {
        let field = filter.field
        let condition = filter.chain
        url += field + '='
        for (const [index, child] of filter.children.entries()) {
          url += child.operator + '.' + child.value
          if (index + 1 !== filter.children.length) url += ','
          else url += '_' + condition
        }
        if (i + 1 !== this.filters.filter.length) url += '&'
      }
      url += '&and_or=' + this.filters.condition
      this.$emit('filterurl', url)
      this.defineActiveState()
      if (close) { this.close() }
    },
    reset() {
      this.filters.filter = [Object.assign({}, this.defaultFilter)]
      this.$emit('filterurl', ' ')
      this.$emit('active-flag', false)
    },
    addFilter () {
      // add new filter field condition
      const tmp = {
        id: '',
        sequence: 1,
        field: this.usableFields[0],
        children: [
          {
            id: '',
            sequence: 1,
            operator: this.operators[0],
            value: ''
          }
        ]
      }
      this.filters.filter.push(tmp)
    },
    addChild (index) {
      // add new filter condition for existing field
      this.filters.filter[index].children.push({ operator: this.operators[0] })
    },
    removeChild (index, i) {
      // spare last filter
      if (this.filters.filter.length == 1 && this.filters.filter[0].children.length == 1) {
        return
      }
      // remove child condiction of filter
      this.filters.filter[index].children.splice(i, 1)
      // delete filter if all conditions got deleted
      if (this.filters.filter[index].children.length === 0) {
        this.filters.filter.splice(index, 1)
      }
      
    },
    defineActiveState () {
        if (this.filters.filter.length == 1) {
          if (this.filters.filter[0].children[0].value !== '') {
            this.$emit('active-flag', true)
          } else {
            this.$emit('active-flag', false)
          }
        } else {
          this.$emit('active-flag', true)
        }
      }
  }
}
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
