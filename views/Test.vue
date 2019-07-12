<template>
  <v-container>
    <v-layout wrap align-center>

       <v-flex xs12 sm6 md4 lg3>
         <v-text-field
            v-model="endpoint"
            error=true
            error-messages="No">
          </v-text-field>
       </v-flex>

      <v-flex xs12 sm6 md4 lg3>
        <v-btn @click="request()">Ajax request</v-btn>
      </v-flex>

      <v-flex xs12 sm6 md4 lg3>
        <app-multi-select :items="myroles" v-model="values"></app-multi-select>
      </v-flex>

      <v-flex xs12 sm6 md4 lg3>
        {{values}}
      </v-flex>

      <v-flex xs12 sm12 md12 lg12>
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
  </v-container>
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
    send () {
      axios({
        method: 'patch',
        url: `user/change_password`,
        data: {
          username: 'initial',
          password: 'Affe1234',
          password_new: 'Apfel1234',
          password_new_verification: 'Apfel1234'
        }
      })
        .then(resp => {
          //
        })
    },
    request () {
      axios({
        method: 'get',
        url: `${this.endpoint}`
      })
        .then(resp => {
          this.txt = resp.data.get
        })
      },
      initialize () {
        axios.get('/')
          .then(resp => {
            this.txt = resp.data
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
    this.$store.dispatch('initialize')
  }
}
</script>

<style>

</style>
