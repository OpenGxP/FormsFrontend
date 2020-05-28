<template>

  <v-card flat>
    <v-toolbar color="secondary">
      <v-toolbar-title>Form Builder</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!--<v-btn
          icon
          @click="validate()"
        >
          <v-icon>save</v-icon>
        </v-btn>-->
        <v-btn
          icon
          @click="parseInternalModel()"
        >
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="close()"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar-items>

      <template v-slot:extension>
        <!-- tabs -->
        <v-tabs
          v-model="tab"
          align-with-title
        >
          <v-tab
            v-for="section in sections"
            :key="section.sectionSequence"
          >
            <v-badge
              :value="eee.includes(section.sectionSequence.toString())"
              color="error"
              dot
            >
              <span v-text="section.sectionName"></span>
            </v-badge>
          </v-tab>
          <v-btn
            text
            @click="addSection()"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-tabs>
      </template>

    </v-toolbar>

    <v-card-text>
      <v-tabs-items v-model="tab">

        <!-- tab content -->
        <v-tab-item
          v-for="section in sections"
          :key="section.sectionSequence"
        >
          <v-row>
            <v-container>
              <!-- section head-->
              <v-col cols="12">
                <v-card color="secondary">
                  <v-card-title>
                    Section Head
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          text
                          :disabled="sections.length === 1"
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
                        <app-text-field
                          v-model="section.sectionName"
                          :counter="meta.section.section.max_length"
                          :hint="meta.section.section.help_text"
                          :label="meta.section.section.verbose_name"
                          :required="meta.section.section.required"
                          :maxlength="meta.section.section.max_length"
                          :editable="isReferenced(section.sectionName)"
                          :errormsgs="getSectionErrorMsgs(section.sectionSequence, 'sections','section')"
                        />
                      </v-col>
                      <v-col>
                        <app-select
                          v-model="section.sectionRole"
                          :hint="meta.section.role.help_text"
                          :items="meta.section.role.lookup.data"
                          :label="meta.section.role.verbose_name"
                          :required="meta.section.role.required"
                          :errormsgs="getSectionErrorMsgs(section.sectionSequence, 'sections', 'role')"
                        ></app-select>
                      </v-col>
                      <v-col>
                        <app-select
                          v-model="section.sectionConfirmationType"
                          :hint="meta.section.confirmation.help_text"
                          :items="meta.section.confirmation.lookup.data"
                          :label="meta.section.confirmation.verbose_name"
                          :required="meta.section.confirmation.required"
                          :errormsgs="getSectionErrorMsgs(section.sectionSequence, 'sections', 'confirmation')"
                        ></app-select>
                      </v-col>
                      <v-col>
                        <app-select
                          v-if="section.sectionSequence > 1"
                          v-model="section.sectionPredecessors"
                          :items="predecessors.filter(name => name !== section.sectionName)"
                          :hint="meta.section.predecessors.help_text"
                          :label="meta.section.predecessors.verbose_name"
                          :required="meta.section.predecessors.required"
                          multiple
                          :errormsgs="getSectionErrorMsgs(section.sectionSequence, 'sections', 'predecessors')"
                        ></app-select>
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
                      color="secondary"
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
                        <!--
                        <v-icon
                          v-if="getFieldErrorMsgs( section.sectionSequence, field.fieldType === 'Text' ? 'fields_text' : 'fields_bool', '')"
                          color="green"
                        >done</v-icon>
                        -->
                        <v-icon
                          v-if="getFieldErrorMsgs(section.sectionSequence, field.fieldSequence, field.fieldType === 'Text' ? 'fields_text' : 'fields_bool', '')"
                          color="error"
                        >error</v-icon>
                      </template>
                    </v-expansion-panel-header>

                    <!-- content -->
                    <v-expansion-panel-content color="secondary">
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
                              <app-text-field
                                v-model="field.fieldName"
                                :counter="meta.fields.field.max_length"
                                :hint="meta.fields.field.help_text"
                                :label="meta.fields.field.verbose_name"
                                :required="meta.fields.field.required"
                                :maxlength="meta.fields.field.max_length"
                                :errormsgs="getFieldErrorMsgs( section.sectionSequence, field.fieldSequence, field.fieldType === 'Text' ? 'fields_text' : 'fields_bool', 'field')"
                              />
                            </v-col>
                            <v-col cols="4">
                              <app-text-field
                                v-if="field.fieldType === 'Text'"
                                v-model="field.fieldDefault"
                                :counter="meta.fields.default.max_length"
                                :hint="meta.fields.default.help_text"
                                :label="meta.fields.default.verbose_name"
                                :required="meta.fields.default.required"
                                :maxlength="meta.fields.default.max_length"
                              />
                              <v-select
                                v-else-if="field.fieldType === 'Select'"
                                v-model="field.fieldDefault"
                                :items="['one', 'two']"
                                :label="meta.fields.default.verbose_name"
                              ></v-select>
                              <v-switch
                                v-else
                                v-model="field.fieldDefault"
                                :label="meta.fields.default.verbose_name"
                              ></v-switch>
                            </v-col>
                            <v-col cols="6">
                              <app-textarea
                                v-model="field.fieldInstructionText"
                                :counter="meta.fields.instruction.max_length"
                                :hint="meta.fields.instruction.help_text"
                                :label="meta.fields.instruction.verbose_name"
                                filled
                              />
                            </v-col>
                            <v-col
                              cols="12"
                              v-if="field.fieldType === 'Select'"
                            >
                              <app-textarea />
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
      </v-tabs-items>
    </v-card-text>
  </v-card>

</template>

<script>
import _ from 'lodash'
import appTextField from '@/components/inputs/AppTextField'
import appTextarea from '@/components/inputs/AppTextarea'
import appSelect from '@/components/inputs/AppSelect'

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
    }
  },

  data () {
    return {
      tab: null,
      sections: [
        {
          sectionName: 'Section 0',
          sectionRole: '',
          sectionPredecessors: [],
          sectionSequence: 0,
          sectionConfirmationType: 'logging',
          sectionFields: [
            {
              fieldType: 'Text',
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
        sectionName: 'Default',
        sectionRole: '',
        sectionPredecessors: [],
        sectionSequence: 1,
        sectionConfirmationType: 'logging',
        sectionFields: []
      },
      defaultField: {
        fieldType: 'Text',
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

  components: {
    appTextField,
    appTextarea,
    appSelect
  },

  computed: {
    maxSectionSequence () {
      // returns current max sequence of all sections
      return Math.max.apply(Math, this.sections.map(section => section.sectionSequence))
    },
    predecessors () {
      return this.sections.filter(section => section.sectionName !== '' && section.sectionName !== undefined).map(section => section.sectionName)
    },
    test () {
      return _.size(this.errorMsgs)
    },
    eee () {
      if (_.isEmpty(this.errorMsgs)) return []
      const sec = []
      for (let category of Object.keys(this.errorMsgs)) {
        for (const sequence of Object.keys(this.errorMsgs[category])) sec.push(sequence)
      }
      return sec
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
    parseInternalModel (validate = false) {
      const esections = []
      const fieldsText = []
      const fieldsBool = []
      // iterate over sections
      for (let section of this.sections) {
        section = this.removeEmptyFields(section)
        esections.push({
          section: section.sectionName,
          role: section.sectionRole,
          predecessors: _.cloneDeep(section.sectionPredecessors),
          sequence: section.sectionSequence,
          confirmation: section.sectionConfirmationType
        })
        // iterate over fields of section
        for (let field of section.sectionFields) {
          field = this.removeEmptyFields(field)
          const payloadField = {
            section: section.sectionSequence,
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
      if (validate) {
        return {
          'sections': esections,
          'fields_text': fieldsText,
          'fields_bool': fieldsBool
        }
      } else {
        this.$emit('save', {
          'sections': esections,
          'fields_text': fieldsText,
          'fields_bool': fieldsBool
        })
      }
    },
    isReferenced (name) {
      return true // !this.sections.filter(section => section.sectionPredecessors.includes(name)).length
    },
    close () {
      this.$emit('close')
    },
    validate () {
      this.$http.post('/md/forms_validate', this.parseInternalModel(true))
        .catch(err => {
          this.errorMsgs = err.response.data
        })
    },
    getSectionErrorMsgs (sequence, category, field) {
      try {
        return this.errorMsgs[category][sequence][field]
      } catch {
        return []
      }
    },
    getFieldErrorMsgs (parentSequence, sequence, category, field) {
      if (field) {
        try {
          return this.errorMsgs[category][parentSequence][sequence][field]
        } catch {
          return []
        }
      } else {
        try {
          if (this.errorMsgs[category][parentSequence][sequence]) return 1
          return 0
        } catch {
          return 0
        }
      }
    },
    removeEmptyFields (obj) {
      // in object, out object without empty attributes
      for (let attribute of Object.keys(obj)) {
        if (
          obj[attribute] === null ||
          obj[attribute] === undefined ||
          obj[attribute] === ''
        ) {
          delete obj[attribute]
        }
      }
      return obj
    }
  },

  watch: {
    xx: {
      handler (val) {
        if (
          val.length > [] && val !== this.sections
        ) {
          // sort
          let tmp = _.cloneDeep(val)
          tmp = tmp.sort((a, b) => (a.sectionSequence > b.sectionSequence) ? 1 : ((b.sectionSequence > a.sectionSequence) ? -1 : 0))
          for (let section of tmp) {
            section.sectionFields = section.sectionFields.sort((a, b) => (a.fieldSequence > b.fieldSequence) ? 1 : ((b.fieldSequence > a.fieldSequence) ? -1 : 0))
          }
          this.sections = tmp
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
    // setInterval(() => { this.validate() }, 10000)
  }
}
</script>

<style lang="scss" scoped>
</style>
