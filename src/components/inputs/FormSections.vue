<template>
  <v-container>
    <v-card>

      <v-card-title>
        Title
      </v-card-title>

      <v-tabs
        v-model="tab"
        vertical
      >

        <v-tab
          v-for="(section, index) in sections"
          :key="index"
        >
          {{section.section}}
        </v-tab>

        <v-icon @click="addSection()">
          add
        </v-icon>

        <v-tab-item
          v-for="(section, index) in sections"
          :key="index"
        >
          <v-card-text>
            <v-card flat>
              <v-container fluid>

                <v-row>
                  <v-col>
                    Meta
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="3">
                    <v-text-field
                      v-model="section.section"
                      label="section_name"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="section.role"
                      :items="roles"
                      label="section_role"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="section.predecessors"
                      :items="predecessors"
                      label="predecessors"
                      multiple
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="section.confirmation"
                      :items="options"
                      label="confirmation_type"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    Fields
                  </v-col>
                  <v-col>
                    <v-btn
                      text
                      icon
                      @click="addField(index)"
                    >
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row
                  v-for="field in section.fields"
                  :key="field"
                >
                  <v-col cols="4">
                    <v-select
                      :items="fieldTypes"
                      label="field_type"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="field_name"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      label="default_value"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-textarea
                      label="instruction_text"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-checkbox
                      label="mandatory"
                    />
                  </v-col>
                  <v-col cols="12"><v-divider></v-divider></v-col>

                </v-row>

              </v-container>
            </v-card>
          </v-card-text>
        </v-tab-item>

      </v-tabs>

    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    fields: {
      type: Object,
      default: function () {
        return {
        }
      }
    }
  },

  data () {
    return {
      tab: null,
      sections: [
        {
          section: 'one',
          role: '',
          predecessors: [],
          sequence: 0,
          confirmation: '',
          fields: []
        }
      ],
      defaultSection: {
        section: '',
        role: '',
        predecessors: [],
        sequence: 0,
        confirmation: '',
        fields: []
      },
      options: ['logging', 'signature', 'double_control'],
      roles: ['all'],
      fieldTypes: ['boolean', 'text']
    }
  },

  computed: {
    predecessors () {
      return ['one']
    }
  },

  methods: {
    addSection () {
      this.sections.push(Object.assign({}, this.defaultSection))
    },
    addField (index) {
      this.sections[index].fields.push('')
    }
  },

  watch: {
    sections (val) {
      this.tab = val.length - 1
    }
  }
}
</script>
