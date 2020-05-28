<template>
  <div>
    <p>Workflow</p>
    <v-container
      class="pa-2"
      fluid
      grid-list-md
    >
      <template v-for="step in steps">
        <v-layout
          :key="step.sequence"
          column
        >
          <v-flex>
            <v-card class="pa-2">
              <v-form @input="handleChange">
                <v-layout wrap>
                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <!-- validation-field="step" -->
                    <!-- field step -->
                    <app-text-field
                      v-model="step.step"
                      :label="meta.step.verbose_name"
                      :editable="meta.step.editable && editable && !used.includes(step.step)"
                      :hint="meta.step.help_text"
                      :required="meta.step.required"
                      :counter="meta.step.max_length"
                      :maxlength="meta.step.max_length"
                      :errormsgs="test(step.sequence, 'step')"
                      :success="step.step !== '' && test2(step.sequence, 'step')"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <!-- field role -->
                    <app-select
                      v-model="step.role"
                      :items="meta.role.lookup.data"
                      :label="meta.role.verbose_name"
                      :editable="meta.role.editable && editable"
                      :hint="meta.role.help_text"
                      :required="meta.step.required"
                      :errormsgs="test(step.sequence, 'role')"
                      :success="step.role !== '' && test2(step.sequence, 'role')"
                      @blur="handleChange"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <!-- field predecessors -->
                    <app-select
                      v-if="step.sequence !== 0"
                      v-model="step.predecessors"
                      :items="predecessors.filter(ele => ele !== step.step)"
                      :label="meta.predecessors.verbose_name"
                      multiple
                      :required="meta.predecessors.required"
                      :editable="step.sequence !== 0 && meta.predecessors.editable && editable && !!step.step"
                      :hint="meta.predecessors.help_text"
                      @blur="handleChange"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm12
                    md9
                    class="px-2"
                  >
                    <!-- field text -->
                    <app-textarea
                      v-model="step.text"
                      :label="meta.text.verbose_name"
                      :editable="meta.text.editable && editable"
                      :disabled="!meta.text.editable || !editable"
                      :hint="meta.text.help_text"
                      :required="meta.text.required"
                      :counter="meta.text.max_length"
                      :maxlength="meta.text.max_length"
                      :errormsgs="test(step.sequence, 'text')"
                      :success="step.text !== '' && test2(step.sequence, 'text')"
                      @blur="handleChange"
                    />
                  </v-flex>

                  <v-btn
                    v-if="step.sequence !== 0 && editable"
                    absolute
                    dark
                    fab
                    bottom
                    right
                    color="pink"
                    small
                    @click="remove(step.sequence, step.step)"
                  >
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-layout>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </template>

      <v-btn
        v-if="editable"
        :disabled="emptyStep"
        icon
        @click="add"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import _ from 'lodash'
import appTextField from '@/components/inputs/AppTextField'
import appTextarea from '@/components/inputs/AppTextarea'
import appSelect from '@/components/inputs/AppSelect'

export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    meta: {
      type: Object
    },
    editable: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMsgs: {
      type: [Array, Object]
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  components: {
    appTextField,
    appTextarea,
    appSelect
  },

  data () {
    return {
      steps: [],
      defaultSteps: [
        {
          step: '',
          role: '',
          predecessors: [],
          text: '',
          sequence: 0
        }
      ],
      successMsgs: []
    }
  },

  computed: {
    predecessors () {
      return this.steps.filter(step => step.step !== '' && step.step !== undefined).map(step => step.step)
    },
    vertices () {
      return this.steps.map(x => x.step)
    },
    edges () {
      const _edges = []
      for (let step of this.steps) {
        for (let predecessor of step.predecessors) {
          _edges.push([predecessor, step.step])
        }
      }
      return _edges
    },
    emptyStep () {
      return this.steps.map(x => x.step).includes('')
    },
    used (step) {
      return this.steps.map(step => step.predecessors).flat()
    }
  },

  watch: {
    data: {
      handler (val) {
        // check value of prop data, if emtpy assign clone of default step (empty step)
        if (val.length === 0) this.steps = _.cloneDeep(this.defaultSteps)
        else if (this.steps !== val) {
          // if there is more than one step, sort arry by sequence
          if (val.length > 1) this.steps = val.sort((a, b) => (a.sequence > b.sequence) ? 1 : ((b.sequence > a.sequence) ? -1 : 0))
          else this.steps = val
        }
      },
      immediate: true,
      depp: true
    },
    active: {
      handler (val) {
        if (!val) {
          // reset component data when not active
          this.steps = _.cloneDeep(this.defaultSteps)
          this.successMsgs = []
        }
      },
      immediate: true
    },
    errorMsgs: {
      handler (val) {
        // return snapshot of successful fields
        // case one, multiple or no errors
        if (!Array.isArray(val) && this.error) this.getSuccessMsgs()
        // case overall error
        // else this.getSuccessMsgs()
      }
    },
    steps: {
      handler (val) {
        this.handleChange()
      }
    }
  },

  methods: {
    add () {
      // check if there is an empty step field
      if (!this.emptyStep) {
        this.steps.push({
          step: '',
          role: '',
          predecessors: [],
          text: '',
          sequence: Math.max.apply(Math, this.steps.map(step => step.sequence)) + 1
        })
      }
    },
    remove (index, name) {
      // remove step
      this.steps = _.reject(this.steps, step => step.sequence === index)
      // remove predecessors and adapt sequence
      for (let step of this.steps) {
        if (step.predecessors.includes(name)) step.predecessors = step.predecessors.filter(item => item !== name)
        if (step.sequence > index) step.sequence -= 1
      }
    },
    isReferenced (val) {
      // checks if step is referenceed
      // returns boolean
      for (let step of this.steps) {
        if (step.predecessors.includes(val)) return true
      }
      return false
    },
    isUnique (val) {
      // checks if step is referenceed
      // returns boolean
      for (let step of this.steps) {
        if (step.step === val) return { error: false, msg: [] }
      }
      return { error: true, msg: ['Step not unique'] }
    },
    handleChange (e) {
      this.$emit('input', this.steps)
    },
    reset () {
      this.steps = _.cloneDeep(this.defaultSteps)
    },
    getSuccessMsgs () {
      this.successMsgs = []
      // iterate over steps
      for (let step of this.steps) {
        // iterate attributes of step
        for (let key of Object.keys(step)) {
          try {
            if (!this.errorMsgs[step.sequence][key] && key !== 'sequence' && step[key].length !== 0) {
              this.successMsgs.push({ seq: step.sequence, field: key })
            }
          } catch {
            if (key !== 'sequence' && !step[key].length !== 0) this.successMsgs.push({ seq: step.sequence, field: key })
          }
        }
      }
    },
    test (sequence, field) {
      try {
        return this.errorMsgs[sequence][field]
      } catch {
        return []
      }
    },
    test2 (sequence, field) {
      // returns true if field of sequence is not in err msg
      try {
        for (let entry of this.successMsgs) {
          if (entry.seq === sequence && entry.field === field) return true
        }
        return false
      } catch {
        return false
      }
    }
  }
}
</script>

<style>
</style>
