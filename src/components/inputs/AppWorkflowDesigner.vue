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
          column
          :key="index"
        >
          <v-flex>
            <v-card
              color="#d3d3d3"
              class="pa-2"
            >
              <v-form>
                <v-layout wrap>
                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <v-text-field
                      v-model="step.step"
                      label="ID"
                      @blur="$v.step.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <v-select
                      :items="roles"
                      v-model="step.role"
                      label="Role"
                    ></v-select>
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <v-select
                      v-if="index !== 0"
                      :items="predecessors"
                      v-model="step.predecessors"
                      label="Predecessors"
                      multiple
                      :disabled="index === 0"
                    ></v-select>
                  </v-flex>

                  <v-flex
                    xs12
                    sm12
                    md9
                    class="px-2"
                  >
                    <v-textarea
                      v-model="step.text"
                      label="Instruction text"
                      auto-grow
                      clearable
                      rows="1"
                    ></v-textarea>
                  </v-flex>

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
                    v-if="index !== 0"
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
        icon
        @click="add"
      >
        <v-icon>add</v-icon>
      </v-btn>

    </v-container>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      steps: [
        {
          step: '1',
          role: '',
          predecessors: [],
          text: ''
          // electronicSignature: false
        }
      ],
      roles: [
        'all',
        'franz',
        'hans',
        'tanz'
      ]
    }
  },

  computed: {
    predecessors () {
      return this.steps.map(x => x.step)
    },
    stepErrors () {
      const errors = []
      if (!this.$v.step.$dirty) return errors
      !this.$v.step.required && errors.push('Item is required')
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

  validations: {
    step: {
      required
    }
  },

  methods: {
    // TODO: Build validation
    add () {
      this.steps.push({
        step: '',
        role: '',
        predecessors: '',
        text: ''
        // electronicSignature: false
      })
    },
    remove (index) {
      this.steps.splice(index, 1)
    },
    submitStep () {
      this.$v.touch()
    }
  }
}
</script>

<style>
</style>
