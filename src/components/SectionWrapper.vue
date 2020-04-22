<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <!--activator-->
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"
        >Form Designer</v-btn>
      </template>

      <!--content-->
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title>Form Builder</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon>
              <v-icon>save</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <app-section
          :xx="internalModel"
          :meta="meta1"
          @save="save($event)"
        ></app-section>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
// import { payloadSection, payloadText, payloadBool, toInternal } from '@/helpers/dev'
import { toInternal } from '@/helpers/dev'
import appSection from '@/components/section'

export default {
  props: {
    meta: {
      type: Object
    },
    xx: {
      type: Object
    }
  },

  data () {
    return {
      // wrapper
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      meta1: {}
    }
  },

  computed: {
    internalModel () {
      // return toInternal(payloadSection, payloadText, payloadBool)
      return toInternal(this.xx['sections'], this.xx['fields_text'], this.xx['fields_bool'])
    }
  },

  methods: {
    save (data) {
      this.$emit('save', data)
    }
  },
  components: {
    appSection
  },

  mounted () {
    this.$http.get('meta/forms')
      .then(resp => {
        this.meta1 = {
          section: resp.data.post.sections,
          fields: resp.data.post.fields_text
        }
      })
  }
}
</script>
