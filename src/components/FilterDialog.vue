<template>

  <v-dialog
    v-model="dialog"
    @click:outside="close()"
    width="800"
  >

    <v-card>

      <!-- title -->
      <v-card-title>
        <span class="headline">Filter</span>
        <v-spacer></v-spacer>
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
              <v-card color="primary">
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
                        v-model="filter.field"
                        :items="usableFields"
                        v-if="i === 0"
                      ></v-combobox>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        :items="operators"
                        v-model="condition.operator"
                      ></v-select>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="condition.value"
                        append-outer-icon="cancel"
                        @keyup.enter="test(false)"
                        @click:append-outer="removeChild(index, i)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-radio-group
                    v-model="filter.chain"
                    row
                    :mandatory="true"
                  >
                    <v-radio
                      label="AND"
                      value="and"
                    ></v-radio>
                    <v-radio
                      label="OR"
                      value="or"
                    ></v-radio>
                  </v-radio-group>
                  <div class="flex-grow-1"></div>
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
                v-model="filters.condition"
                row
                :mandatory="true"
              >
                <v-radio
                  label="AND"
                  value="and"
                ></v-radio>
                <v-radio
                  label="OR"
                  value="or"
                ></v-radio>
              </v-radio-group>

            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                :disabled="filters.filter.length === fields.length"
                @click="addFilter()"
              >Add</v-btn>
            </v-col>
          </v-row>

        </v-container>

      </v-card-text>

      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          color="blue darken-1"
          text
          @click="close()"
        >Close</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="test(false)"
        >Apply</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="test()"
        >Save</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

</template>

<script>
export default {
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
      operators: ['contains', 'equal', 'startswith', 'endswith']
    }
  },

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

  computed: {
    usableFields () {
      const usedFields = this.filters.filter.map(x => x.field)
      console.log(usedFields.includes('two'))
      return this.fields.filter(x => !(usedFields.includes(x)))
    },
    url () {
      let url = ''
      for (const [i, filter] of this.filters.filter) {
        console.log(filter)
        let field = filter.field
        let condition = filter.chain
        url += field + '='
        for (const [index, child] of filter.children) {
          url += child.operator + '.' + child.value
          if (index - 1 !== filter.children.length) url += ','
          else url += '_' + condition
        }
        if (i - 1 !== this.filters.filter.length) url += '&'
      }
      url += this.filters.condition
      return url
    }
  },

  methods: {
    close () {
      this.$emit('close-dialog', false)
    },
    test (close = true) {
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
      console.log(url)
      this.$emit('filterurl', url)
      if (close) { this.close() }
    },
    addFilter () {
      // const tmp = Object.assign({}, this.defaultFilter)
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
      this.filters.filter[index].children.push({ operator: this.operators[0] })
    },
    removeChild (index, i) {
      // remove child condiction of filter
      this.filters.filter[index].children.splice(i, 1)
      // delete filter if all conditions got deleted
      if (this.filters.filter[index].children.length === 0) {
        this.filters.filter.splice(index, 1)
      }
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
  }
}
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
