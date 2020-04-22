export const payloadSection = [
  {
    section: 'sectionOne',
    role: 'all',
    sequence: 0,
    predecessors: [''],
    confirmation: 'logging'
  },
  {
    section: 'sectionTwo',
    sequence: 1,
    predecessors: ['sectionOne'],
    confirmation: 'logging'
  }
]

export const payloadText = [
  {
    section: 'sectionOne',
    field: 'textfieldOne',
    mandatory: true,
    instruction: 'text',
    sequence: 0
  },
  {
    section: 'sectionTwo',
    field: 'textfieldTwo',
    mandatory: true,
    instruction: 'text2',
    sequence: 0
  }
]

export const payloadBool = [
  {
    section: 'sectionOne',
    field: 'boolfieldOne',
    mandatory: false,
    instruction: 'text',
    sequence: 1
  }
]

export function toExternal (paramSections) {
  /*
  * Parser for internal data model
  * object to object
  */
  const sections = []
  const fieldsText = []
  const fieldsBool = []
  // iterate over sections
  for (const section of paramSections) {
    sections.push({
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
  return {
    sections: sections,
    fields_text: fieldsText,
    fields_bool: fieldsBool
  }
}

export function toInternal (sections, fieldsText, fieldsBool) {
  /*
  * Parses for payload
  * arrays of payload to internal data model object
  */
  // check for empty data in case of initial creation
  if (!sections) return []
  // variable for internal data model
  const dataModell = []
  // sections
  for (const section of sections) {
    dataModell.push(
      {
        sectionName: section.section,
        sectionRole: section.role,
        sectionPredecessor: section.predecessors,
        sectionSequence: section.sequence,
        sectionConfirmationType: section.confirmation,
        sectionFields: []
      }
    )
  }
  // text fields
  for (const field of fieldsText) {
    dataModell.filter(section => section.sectionName === field.section)[0].sectionFields.push(
      {
        fieldType: 'Text',
        fieldName: field.field,
        // fieldDefault: '',
        fieldInstructionText: field.instruction,
        fieldMandatory: field.mandatory,
        fieldSequence: field.sequence
      }
    )
  }
  // bool fields
  for (const field of fieldsBool) {
    dataModell.filter(section => section.sectionName === field.section)[0].sectionFields.push(
      {
        fieldType: 'Boolean',
        fieldName: field.field,
        // fieldDefault: '',
        fieldInstructionText: field.instruction,
        fieldMandatory: field.mandatory,
        fieldSequence: field.sequence
      }
    )
  }
  return dataModell
}
