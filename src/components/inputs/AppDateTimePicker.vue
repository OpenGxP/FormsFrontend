<template>
  <v-row>
    <v-col
      xs12
      sm6
      md6
      mx-2
    >
      <v-dialog
        ref="dialogDate"
        v-model="modal"
        :return-value.sync="dateIn"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateIn"
            :label="`${label} date`"
            append-icon="event"
            readonly
            :disabled="!editable"
            @click:append="modal = true"
          />
        </template>
        <v-date-picker
          v-model="dateIn"
          scrollable
          @change="eventHandler"
        >
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="modal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="saveDate(dateIn)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-col>

    <v-col
      xs12
      sm6
      md6
      mx-2
    >
      <v-dialog
        ref="dialog"
        v-model="modal2"
        :return-value.sync="timeIn"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="timeIn"
            :label="`${label} time`"
            append-icon="access_time"
            readonly
            :disabled="!editable"
            v-on="on"
            @click:append="modal2 = true"
          />
        </template>
        <v-time-picker
          v-if="modal2"
          v-model="timeIn"
          use-seconds
          scrollable
          format="24hr"
          @change="eventHandler"
        >
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="modal2 = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="saveTime(timeIn)"
          >
            OK
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ['dateTimeProp', 'editable', 'label'],

  data () {
    return {
      dateIn: this.dateTimeProp ? this.dateTimeProp.substring(0, 10) : '',
      timeIn: this.dateTimeProp ? this.dateTimeProp.substring(11, 19) : '',
      modal: false,
      modal2: false,
      select: true
    }
  },

  computed: {
    datetime () {
      if (this.dateIn === '' && this.timeIn === '') {
        return ''
      } else if (this.dateIn !== '' && this.timeIn === '') {
        return `${this.dateIn}T00:00:00Z`
      } else if (this.dateIn === '' && this.timeIn !== '') {
        return `2019-01-01T${this.timeIn}Z`
      } else {
        return `${this.dateIn}T${this.timeIn}Z`
      }
    }
  },

  watch: {
    dateTimeProp: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.dateIn = newVal.substring(0, 10)
          this.timeIn = newVal.substring(11, 19)
        } else {
          this.dateIn = ''
          this.timeIn = ''
        }
      }
    }
  },

  methods: {
    eventHandler (e) {
      this.$emit('change-val', this.datetime)
    },
    saveTime (time) {
      this.$refs.dialog.save(time)
      this.$emit('change-val', this.datetime)
    },
    saveDate (date) {
      this.$refs.dialogDate.save(date)
      this.$emit('change-val', this.datetime)
    }
  }
}
</script>

<style>
</style>
