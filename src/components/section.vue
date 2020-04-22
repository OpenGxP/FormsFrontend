<template>
  <v-container style="padding-top: 50px;">
    <v-card color="primary">
      <v-card-title class="headline">Form Builder
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="parseInternalModel()"
        >
          <v-icon>save</v-icon>
        </v-btn>
      </v-card-title>
      <!-- tabs -->
      <v-tabs
        background-color="grey darken-2"
        vertical
      >
        <v-tab
          v-for="section in sections"
          :key="section.sectionSequence"
        >
          <span v-text="section.sectionName"></span>
        </v-tab>
        <v-btn
          text
          @click="addSection()"
        >
          <v-icon>add</v-icon>
        </v-btn>

        <!-- tab content -->
        <v-tab-item
          v-for="section in sections"
          :key="section.sectionSequence"
        >
          <v-row>
            <v-container>
              <!-- section head-->
              <v-col cols="12">
                <v-card color="#385F73">
                  <v-card-title>
                    Section Head
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          text
                          :disabled="section.sectionSequence === 0 && sections.length === 1"
                          v-on="on"
                          @click="deleteSection(section.sectionSequence)"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete Section</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="section.sectionName"
                          :counter="meta.section.section.max_length"
                          :hint="meta.section.section.help_text"
                          :label="meta.section.section.verbose_name"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-select
                          v-model="section.sectionRole"
                          :hint="meta.section.role.help_text"
                          :items="meta.section.role.lookup.data"
                          :label="meta.section.role.verbose_name"
                        ></v-select>
                      </v-col>
                      <v-col>
                        <v-select
                          v-model="section.sectionConfirmationType"
                          :hint="meta.section.confirmation.help_text"
                          :items="meta.section.confirmation.lookup.data"
                          :label="meta.section.confirmation.verbose_name"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="field in section.sectionFields"
                    :key="field.fieldSequence"
                  >
                    <!-- header -->
                    <v-expansion-panel-header
                      disable-icon-rotate
                      color="#385F73"
                    >

                      <template v-slot:default="{ open }">
                        <v-row no-gutters>
                          <v-col cols="4">
                            <span v-text="field.fieldName ? `${field.fieldSequence} - ${field.fieldName}` : `${field.fieldSequence} - Field Name`"></span>
                          </v-col>
                          <v-col
                            cols="8"
                            class="text--secondary"
                          >
                            <span v-if="!open">{{field.fieldType}}</span>
                          </v-col>
                        </v-row>
                      </template>

                      <!-- editing status-->
                      <template v-slot:actions>
                        <v-icon
                          v-if="field.fieldName && field.fieldType"
                          color="green"
                        >done</v-icon>
                        <v-icon
                          v-else
                          color="error"
                        >error</v-icon>
                      </template>
                    </v-expansion-panel-header>

                    <!-- content -->
                    <v-expansion-panel-content color="#385F73">
                      <v-card flat>
                        <v-card-text>
                          <v-row>
                            <v-col cols="4">
                              <v-select
                                label="Field Type"
                                v-model="field.fieldType"
                                :items="fieldTypes"
                              ></v-select>
                            </v-col>
                            <v-col cols="4">
                              <v-text-field
                                v-model="field.fieldName"
                                :counter="meta.fields.field.max_length"
                                :hint="meta.fields.field.help_text"
                                :label="meta.fields.field.verbose_name"
                              >
                                <template v-slot:label>
                                  <div>
                                    {{meta.fields.field.verbose_name}}<span
                                      v-if="meta.fields.field.mandatory"
                                      class="red--text"
                                    >*</span>
                                  </div>
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="4">
                              <v-text-field
                                v-if="field.fieldType === 'Text'"
                                v-model="field.defaultField"
                                :counter="meta.fields.default.max_length"
                                :hint="meta.fields.default.help_text"
                                :label="meta.fields.default.verbose_name"
                              ></v-text-field>
                              <v-switch
                                v-else
                                v-model="field.defaultField"
                                :label="meta.fields.default.verbose_name"
                              ></v-switch>
                            </v-col>
                            <v-col cols="6">
                              <v-textarea
                                v-model="field.fieldInstructionText"
                                :counter="meta.fields.instruction.max_length"
                                :hint="meta.fields.instruction.help_text"
                                :label="meta.fields.instruction.verbose_name"
                                filled
                              ></v-textarea>
                            </v-col>
                          </v-row>
                          <v-divider></v-divider>
                        </v-card-text>
                        <v-card-actions style="height: 50px">
                          <!--new-->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                v-on="on"
                                @click="addField(section.sectionSequence, field.fieldSequence)"
                              >
                                <v-icon>add</v-icon>
                              </v-btn>
                            </template>
                            <span>New field</span>
                          </v-tooltip>
                          <!--duplicate-->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                v-on="on"
                                @click="duplicateField(section.sectionSequence, field.fieldSequence, field)"
                              >
                                <v-icon>queue</v-icon>
                              </v-btn>
                            </template>
                            <span>Duplicate field</span>
                          </v-tooltip>
                          <!--delete-->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                v-on="on"
                                :disabled="field.fieldSequence === 0 && section.sectionFields.length === 1"
                                @click="deleteField(section.sectionSequence, field.fieldSequence)"
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Delete field</span>
                          </v-tooltip>
                          <!--move up-->
                          <v-tooltip
                            v-if="field.fieldSequence !== 0 && section.sectionFields.length !== 1"
                            bottom
                          >
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                v-on="on"
                                @click="moveField(section.sectionSequence, field.fieldSequence, 'up')"
                              >
                                <v-icon>keyboard_arrow_up</v-icon>
                              </v-btn>
                            </template>
                            <span>Move field up</span>
                          </v-tooltip>
                          <!--move down-->
                          <v-tooltip
                            v-if="field.fieldSequence + 1 !== section.sectionFields.length  && section.sectionFields.length !== 1"
                            bottom
                          >
                            <template v-slot:activator="{ on }">
                              <v-btn
                                icon
                                v-on="on"
                                @click="moveField(section.sectionSequence, field.fieldSequence, 'down')"
                              >
                                <v-icon>keyboard_arrow_down</v-icon>
                              </v-btn>
                            </template>
                            <span>Move field down</span>
                          </v-tooltip>
                          <v-spacer></v-spacer>
                          <v-switch
                            v-model="field.fieldMandatory"
                            :label="meta.fields.mandatory.verbose_name"
                            class="pr-2"
                          ></v-switch>
                          <v-btn icon>
                            <v-icon>more_vert</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-container>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card>

  </v-container>
</template>

<script>
export default {

  props: {
    meta: {
      type: Object,
      mandatory: false
    },
    xx: {
      Type: Array,
      mandatory: false,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      sections: [
        {
          sectionName: 'Section 0',
          sectionRole: '',
          sectionPredecessor: [],
          sectionSequence: 0,
          sectionConfirmationType: '',
          sectionFields: [
            {
              fieldType: '',
              fieldName: '',
              fieldDefault: '',
              fieldInstructionText: '',
              fieldMandatory: false,
              fieldSequence: 0
            }
          ]
        }
      ],
      defaultSection: {
        sectionName: '',
        sectionRole: '',
        sectionPredecessor: [],
        sectionSequence: 1,
        sectionConfirmationType: '',
        sectionFields: []
      },
      defaultField: {
        fieldType: '',
        fieldName: '',
        fieldDefault: '',
        fieldInstructionText: '',
        fieldMandatory: false,
        fieldSequence: 0
      },
      fieldTypes: ['Text', 'Boolean'],
      panels: {}
    }
  },

  computed: {
    maxSectionSequence () {
      // returns current max sequence of all sections
      return Math.max.apply(Math, this.sections.map(section => section.sectionSequence))
    }
  },

  methods: {
    addSection () {
      // add default section with current max sequence plus one
      const section = Object.assign({}, this.defaultSection)
      section.sectionSequence = this.maxSectionSequence + 1
      section.sectionName = `Section ${this.maxSectionSequence + 1}`
      section.sectionFields = [Object.assign({}, this.defaultField)]
      this.sections.push(section)
    },
    deleteSection (sequence) {
      if (this.sections.length > 1) {
        // delete current section
        this.sections = this.sections.filter(section => section.sectionSequence !== sequence)
        // reposition sections
        this.sections = this.sections.map(section => {
          if (section.sectionSequence > sequence) section.sectionSequence -= 1
          return section
        })
      }
    },
    addField (sectionSequence, fieldSequence) {
      // variable that stores reference to current section
      const section = this.sections.filter(section => section.sectionSequence === sectionSequence)[0]
      // variable that stores field to be added
      const field = Object.assign({}, this.defaultField)
      // assign new sequence
      field.fieldSequence = fieldSequence + 1
      field.fieldName = `Field Name`
      // repostion fields
      section.sectionFields = section.sectionFields.map(field => {
        if (field.fieldSequence > fieldSequence) field.fieldSequence += 1
        return field
      })
      // add field
      section.sectionFields.push(field)
      // sort
      section.sectionFields.sort((a, b) => (a.fieldSequence > b.fieldSequence) ? 1 : -1)
    },
    duplicateField (sectionSequence, fieldSequence, duplicatedField) {
      // variable that stores reference to current section
      const section = this.sections.filter(section => section.sectionSequence === sectionSequence)[0]
      // variable that stores field to be added
      const field = Object.assign({}, duplicatedField)
      // assign new sequence
      field.fieldSequence = fieldSequence + 1
      // repostion fields
      section.sectionFields = section.sectionFields.map(field => {
        if (field.fieldSequence > fieldSequence) field.fieldSequence += 1
        return field
      })
      // add field
      section.sectionFields.push(field)
      // sort
      section.sectionFields.sort((a, b) => (a.fieldSequence > b.fieldSequence) ? 1 : -1)
    },
    deleteField (sectionSequence, fieldSequence) {
      // variable that stores reference to current section
      const section = this.sections.filter(section => section.sectionSequence === sectionSequence)[0]
      if (section.sectionFields.length > 1) {
        // delete current filed
        section.sectionFields = section.sectionFields.filter(field => field.fieldSequence !== fieldSequence)
        // reposition fields
        section.sectionFields = section.sectionFields.map(field => {
          if (field.fieldSequence > fieldSequence) field.fieldSequence -= 1
          return field
        })
      }
    },
    moveField (sectionSequence, fieldSequence, direction) {
      /*
      let fields = Object.assign({}, this.sections.filter(section => section.sectionSequence === sectionSequence)[0].sectionFields)
      fields = fields.map(field => {
        switch (direction) {
          // up
          case 'up':
            if (field.fieldSequence === fieldSequence - 1) field.fieldSequence += 1
            if (field.fieldSequence === fieldSequence) field.fieldSequence -= 1
            break

          // down
          default:
            if (field.fieldSequence === fieldSequence + 1) field.fieldSequence -= 1
            if (field.fieldSequence === fieldSequence) field.fieldSequence += 1
            break
        }
        return field
      })
      */
      // sort
      // section.sectionFields.sort((a, b) => (a.fieldSequence > b.fieldSequence) ? 1 : -1)
    },
    parseInternalModel () {
      const eSections = []
      const fieldsText = []
      const fieldsBool = []
      // iterate over sections
      for (const section of this.sections) {
        eSections.push({
          section: section.sectionName,
          role: section.sectionRole,
          predecessors: section.sectionPredecessor,
          sequence: section.sectionSequence,
          confirmation: section.sectionConfirmationType
        })
        // iterate over fields of section
        for (const field of section.sectionFields) {
          const payloadField = {
            section: section.sectionName,
            field: field.fieldName,
            instruction: field.fieldInstructionText,
            mandatory: field.fieldMandatory,
            sequence: field.fieldSequence,
            default: field.fieldDefault
          }
          switch (field.fieldType) {
            case 'Boolean':
              fieldsBool.push(payloadField)
              break
            default:
              fieldsText.push(payloadField)
              break
          }
        }
      }
      this.$emit('save', {
        'sections': eSections,
        'fields_text': fieldsText,
        'fields_bool': fieldsBool
      })
    }
  },

  watch: {
    xx: {
      handler (val) {
        if (
          val.length > [] && val !== this.sections
        ) {
          this.sections = val
        } else {
          let v = [Object.assign({}, this.defaultSection)]
          v[0].sectionFields = [Object.assign({}, this.defaultField)]
          this.sections = v
        }
      },
      deep: true,
      immediate: true
    }
  },

  mounted () {
    // TODO: delete sections and replace them with default section field combo if data prop is empty
  }
}
</script>

<style lang="scss" scoped>
</style>
