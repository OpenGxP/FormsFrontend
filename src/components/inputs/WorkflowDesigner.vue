<template>
  <v-card
    max-width="800"
    class="mx-auto"
  >
    <v-container
      class="pa-2"
      fluid
      grid-list-md
    >
      <template v-for="(node, index) in nodes">
        <v-layout
          :key="index"
          column
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
                      v-model="node.step"
                      label="ID"
                      :disabled="!editable"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <v-select
                      v-model="node.groups"
                      :items="groups"
                      label="Groups"
                      :disabled="!editable"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm6
                    md4
                    class="px-2"
                  >
                    <v-select
                      v-model="node.predecessors"
                      :items="predecessors"
                      label="Predecessors"
                      multiple
                      :disabled="index === 0 || !editable"
                    />
                  </v-flex>

                  <v-flex
                    xs12
                    sm12
                    md12
                    class="px-2"
                  >
                    <v-textarea
                      v-model="node.text"
                      label="Instruction text"
                      auto-grow
                      clearable
                      rows="1"
                      :disabled="!editable"
                    />
                  </v-flex>

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
  </v-card>
</template>

<script>
export default {
  props: ['meta', 'data', 'editable'],

  data () {
    return {
      nodes: [
        {
          step: '1',
          groups: '',
          predecessors: [],
          text: ''
        }
      ],
      groups: [
        'all',
        'franz',
        'hans',
        'tanz'
      ]
    }
  },

  computed: {
    predecessors () {
      return this.nodes.map(x => x.step)
    }
  },

  methods: {
    add () {
      this.nodes.push({
        step: '',
        groups: '',
        predecessors: '',
        text: ''
      })
    },
    remove (index) {
      this.nodes.splice(index, 1)
    }
  }
}
</script>

<style>
</style>
