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
          :color="getColor"
          dark
          v-on="on"
        >Form Designer</v-btn>
      </template>

      <!--content-->
      <app-section
        :xx="internalModel"
        :meta="meta1"
        :error="error"
        :error-msgs="errorMsgs"
        @save="save($event)"
        @close="close()"
      ></app-section>

    </v-dialog>
  </v-row>
</template>

<script>
import _ from 'lodash'
import { toInternal } from '@/helpers/dev'
import appSection from '@/components/section'

export default {
  props: {
    meta: {
      type: Object
    },
    xx: {
      type: Object
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
    },
    getColor () {
      return _.isEmpty(this.errorMsgs) ? 'primary' : 'error'
    }
  },

  methods: {
    save (data) {
      this.$emit('save', data)
    },
    close () {
      this.dialog = false
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
