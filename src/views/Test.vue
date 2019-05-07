<template>
  <div>
    <v-layout wrap align-center>

       <v-flex xs12 sm6 md4 d-flex>
         <v-text-field
            v-model="endpoint"
            error=true
            error-messages="No">
          </v-text-field>
       </v-flex>

      <v-flex xs12 sm6 md4 d-flex>
        <v-btn @click="request()">Ajax request</v-btn>
      </v-flex>

      <v-flex xs12 sm6 md4 d-flex>
        <app-date-time-picker @sync-date="da=$event"></app-date-time-picker>
      </v-flex>

      <v-flex xs12 sm6 md4 d-flex>
        <v-select
          v-model="values"
          :items="items"
          label="Select Item"
          multiple
        >
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item }}</span>
            </v-chip>
            <span
              v-if="index === 1"
              class="grey--text caption"
            >(+{{ value.length - 1 }} others)</span>
          </template>
        </v-select>
      </v-flex>

      <v-flex xs12 sm6 md4 d-flex>
        <app-multi-select :items="myroles" v-model="values"></app-multi-select>
      </v-flex>

      <v-flex xs12 sm6 md4 d-flex>
        {{values}}
      </v-flex>

      <v-flex xs12 sm12 md12>
        <div>{{txt}}</div>
        <!--
        <ul>
          <li v-for="(value, key, index) in txt" :key="index">
            {{key}} {{value}}
          </li>
        </ul>
        -->
       </v-flex>

    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'
import AppMultiSelect from '@/components/inputs/AppMultiSelect'

export default {
  data: function () {
    return {
      txt: '',
      date: new Date().toISOString().substr(0, 10),
      da: new Date().toISOString().substr(0, 10),
      menu: false,
      endpoint: '/admin/roles',
      items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      values: [],
      roles: []
    }
  },
  components: {
    appDateTimePicker: AppDateTimePicker,
    appMultiSelect: AppMultiSelect
  },
  methods: {
    load () {
      this.$store.dispatch('LOAD_ROLES').then(
        this.txt = this.$store.getters.roles
      )
    },
    request () {
      axios({
        method: 'get',
        url: `${this.endpoint}`
      })
        .then(resp => {
          this.txt = resp.data.get
        })
      }
  },
  computed: {
    myroles () {
      return this.$store.getters.validRoles.map(item => item.role)
    }
  },
  mounted () {
    this.load()
    this.$store.dispatch('LOAD_ROLES')
  }
}
</script>

<style>

</style>
