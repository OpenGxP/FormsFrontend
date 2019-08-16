<template>

  <v-layout wrap>
    <v-flex
      xs12
      sm6
      md4
      mx-2
    >
      <v-dialog
        ref="dialogDate"
        v-model="modal"
        :return-value.sync="dateIn"
        persistent
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateIn"
            label="Picker in dialog"
            append-icon="event"
            readonly
            @click:append="modal = true"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dateIn"
          scrollable
          @change="eventHandler"
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="modal = false"
          >Cancel</v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dialogDate.save(dateIn)"
          >OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>

    <v-flex
      xs12
      sm4
      md4
      mx-2
    >
      <v-dialog
        ref="dialog"
        v-model="modal2"
        :return-value.sync="timeIn"
        persistent
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="timeIn"
            label="Picker in dialog"
            append-icon="access_time"
            readonly
            v-on="on"
            @click:append="modal2 = true"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="modal2"
          v-model="timeIn"
          full-width
          use-seconds
          scrollable
          format="24h"
          @change="eventHandler"
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="modal2 = false"
          >Cancel</v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dialog.save(timeIn)"
          >OK</v-btn>
        </v-time-picker>
      </v-dialog>
    </v-flex>

    <!--
    <v-flex
      xs12
      sm4
      md4
      mx-2
    >
      <v-dialog
        ref="dialog3"
        v-model="modal3"
        :return-value.sync="timeIn"
        persistent
        full-width
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="timeIn"
            label="Picker in dialog"
            append-icon="event"
            readonly
            v-on="on"
            @click:append="modal3 = true"
          ></v-text-field>
        </template>

        <v-sheet v-if="modal3">
          <v-time-picker
            v-if="select"
            v-model="timeIn"
            full-width
            use-seconds
            scrollable
            @change="eventHandler"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="select = !select"
            >Switch</v-btn>

            <v-btn
              text
              color="primary"
              @click="modal3 = false"
            >Cancel</v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.dialog3.save(timeIn)"
            >OK</v-btn>

          </v-time-picker>

          <v-date-picker
            v-else
            v-model="dateIn"
            scrollable
            @change="eventHandler"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modal3 = false"
            >Cancel</v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.Dialog3.save(dateIn)"
            >OK</v-btn>
            <v-btn
              text
              color="primary"
              @click="select = !select"
            >OK</v-btn>
          </v-date-picker>
        </v-sheet>

      </v-dialog>
    </v-flex>
    -->

  </v-layout>

</template>

<script>
export default {
  props: ['dateTimeProp'],

  data () {
    return {
      dateIn: this.dateTimeProp ? this.dateTimeProp.substring(0, 10) : '',
      timeIn: this.dateTimeProp ? this.dateTimeProp.substring(11, 19) : '',
      modal: false,
      modal2: false,
      modal3: false,
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

  methods: {
    handleInput (e) {
      this.$emit('change-value', this.datetime)
    },
    eventHandler (e) {
      this.$emit('change-val', this.datetime)
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
  }
}
// '2019-07-26T13:46:25.340722Z'
</script>

<style>
</style>
