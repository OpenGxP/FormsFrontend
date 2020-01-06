<template>
  <div>
    <p>Workflow</p>
    <v-container
      class="pa-2"
      fluid
      grid-list-md
    >
      <template v-for="(step, index) in steps">
        <v-layout
          :key="index"
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
                    <!-- field step -->
                    <v-text-field
                      v-model="step.step"
                      :label="meta.step.verbose_name"
                      :disabled="!meta.step.editable || !editable"
                      :hint="meta.step.help_text"
                      @blur="$v.step.$touch()"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <!-- field role -->
                    <v-select
                      v-model="step.role"
                      :items="meta.role.lookup.data"
                      :label="meta.role.verbose_name"
                      :disabled="!meta.role.editable || !editable"
                      :hint="meta.role.help_text"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <!-- field predecessors -->
                    <v-select
                      v-if="index !== 0"
                      v-model="step.predecessors"
                      :items="predecessors.filter(ele => ele !== step.step)"
                      :label="meta.predecessors.verbose_name"
                      multiple
                      :disabled="index === 0 || !meta.predecessors.editable || !editable || !step.step"
                      :hint="meta.predecessors.help_text"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm12
                    md9
                    class="px-2"
                  >
                    <!-- field text -->
                    <v-textarea
                      v-model="step.text"
                      :label="meta.text.verbose_name"
                      auto-grow
                      clearable
                      rows="1"
                      :disabled="!meta.text.editable || !editable"
                      :hint="meta.text.help_text"
                    />
                  </v-flex>

                  <!-- field electronic signature -->
                  <!--
                  <v-flex
                    xs12
                    sm12
                    md3
                    class="px-2"
                  >
                    <v-switch
                      v-model="step.electronicSignature"
                      label="Electronic Signature"
                    ></v-switch>
                  </v-flex>
                  -->

                  <v-btn
                    v-if="index !== 0 && editable"
                    absolute
                    dark
                    fab
                    bottom
                    right
                    color="pink"
                    small
                    @click="remove(index)"
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
        icon
        @click="add"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ['data', 'meta', 'editable'],

  data () {
    return {
      steps: [
        {
          step: '',
          role: '',
          predecessors: [],
          text: '',
          sequence: 0
          // electronicSignature: false
        }
      ],
      defaultSteps: [
        {
          step: '',
          role: '',
          predecessors: [],
          text: '',
          sequence: 0
          // electronicSignature: false
        }
      ]
    }
  },

  computed: {
    predecessors () {
      return this.steps.map(x => x.step)
    },
    stepErrors () {
      const errors = []
      return errors
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
    }
  },

  watch: {
    data: {
      immediate: true,
      handler (newVal) {
        // check if value of prop data, if emtpy assign default value (empty step)
        if (newVal.length === 0) this.steps = this.defaultSteps.slice()
        else if (this.steps !== newVal) {
          // if there is more than one step, sort arry by sequence
          if (newVal.length > 1) this.steps = newVal.sort((a, b) => (a.sequence > b.sequence) ? 1 : ((b.sequence > a.sequence) ? -1 : 0))
          else this.steps = newVal
        }
      }
    }
  },

  methods: {
    // TODO: Build validation
    add () {
      // check if there is an empty step field
      if (!this.steps.map(x => x.step).includes('')) {
        this.steps.push({
          step: '',
          role: '',
          predecessors: '',
          text: '',
          sequence: Math.max.apply(Math, this.steps.map(x => x.sequence)) + 1
          // electronicSignature: false
        })
      }
    },
    remove (index) {
      if (this.steps[index]['step']) {
        const kill = this.steps[index]['step']
        for (let ele of this.steps) {
          if (ele.predecessors.includes(kill)) {
            let index = this.steps.indexOf(ele)
            this.steps[index].predecessors = this.steps[index].predecessors.filter(item => item !== kill)
          }
        }
      }
      this.steps.splice(index, 1)
    },
    pre (self) {
      //
    },
    submitStep () {
      this.$v.touch()
    },
    handleChange (e) {
      this.$emit('input', this.steps)
    },
    reset () {
      this.steps = this.defaultSteps.slice()
    }
  }
}
</script>

<style>
</style>
