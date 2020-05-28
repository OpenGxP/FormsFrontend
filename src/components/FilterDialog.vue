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
                      <v-autocomplete
                        v-if="i === 0"
                        v-model="filter.field"
                        :items="usableFields"
                        :return-object="true"
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
import _ from 'lodash'

export default {

  props: {
    // List of filterable fields
    // Array of objects
    fields: {
      type: Array,
      default: function () {
        return []
      }
    },
    // Show / hide filter dialog
    dialog: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      // internal data model
      filters: {
        condition: 'and',
        filter: [
          {
            id: '',
            field: { text: '', value: '' },
            chain: 'and',
            children: [
              {
                id: '',
                operator: 'contains',
                value: ''
              }
            ]
          }
        ]
      },
      // default filter
      defaultFilter: {
        id: '',
        field: { text: '', value: '' },
        chain: 'and',
        children: [
          {
            id: '',
            operator: 'contains',
            value: ''
          }
        ]
      },
      operators: ['contains', 'exact', 'startswith', 'endswith'],
      defaultOperator: 'contains'
    }
  },

  computed: {
    usableFields () {
      const usedFields = this.filters.filter.map(x => x.field)
      return this.fields.filter(x => !(usedFields.includes(x)))
    },
    allConditionsFilled () {
      // checks if all value fields filled
      for (let filter of this.filters.filter) {
        for (let child of filter.children) {
          if (!child.value) return false
        }
      }
      return true
    },
    quickFilters () {
      return this.fields.filter(field => field.quickFilter).map(field => field.quickFilter)
    }
  },

  methods: {
    close () {
      // semit event to parent to close dialog via according prop
      this.$emit('close-dialog', false)
    },
    save (close = true) {
      // TODO: delete quickfilters when saving
      // emit query string and depending on argument close dialog or not
      let url = ''
      for (const [i, filter] of this.filters.filter.entries()) {
        let field = filter.field.value
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
    reset () {
      this.filters.filter = [_.cloneDeep(this.defaultFilter)]
      this.$emit('filterurl', ' ')
      this.$emit('active-flag', false)
    },
    addFilter () {
      // add new filter field if there is one left
      if (this.usableFields) {
        const tmp = _.cloneDeep(this.defaultFilter)
        tmp.field = this.usableFields[0]
        this.filters.filter.push(tmp)
      }
    },
    addChild (index) {
      // add new filter condition for existing field
      const tmp = _.cloneDeep(this.defaultFilter.children[0])
      tmp.operator = this.defaultOperator
      this.filters.filter[index].children.push(tmp)
    },
    removeChild (parentIndex, childIndex) {
      // spare last filter
      if (this.filters.filter.length === 1 && this.filters.filter[0].children.length === 1) {
      } else {
        // remove child condiction of filter
        this.filters.filter[parentIndex].children.splice(childIndex, 1)
        // delete filter if all conditions got deleted
        if (this.filters.filter[parentIndex].children.length === 0) {
          this.filters.filter.splice(parentIndex, 1)
        }
      }
    },
    defineActiveState () {
      if (this.filters.filter.length === 1) {
        if (this.filters.filter[0].children[0].value !== '') {
          this.$emit('active-flag', true)
        } else {
          this.$emit('active-flag', false)
        }
      } else {
        this.$emit('active-flag', true)
      }
    }
  },

  watch: {
    // watch state and apply val for empty filter
    dialog: {
      handler (val) {
        // check for initial creation
        if (val && this.filters.filter[0].field.value === '') {
          if (this.quickFilters.length) {
            // active quickfilters
            if (this.quickFilters) {
              for (let field of this.fields) {
                if (field.quickFilter && this.filters.filter[0].field.value === '') {
                  // first
                  this.filters.filter[0].field = field
                  this.filters.filter[0].children[0].operator = this.defaultOperator
                  this.filters.filter[0].children[0].value = field.quickFilter
                } else if (field.quickFilter) {
                  // additional
                  const tmp = _.cloneDeep(this.defaultFilter)
                  tmp.field = field
                  tmp.children[0].value = field.quickFilter
                  this.filters.filter.push(tmp)
                }
              }
            }
          } else {
            this.filters.filter[0].field = this.usableFields[0]
          }
        }
      },
      deep: true,
      immidiate: true
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
