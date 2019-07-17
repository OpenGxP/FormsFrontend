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


    </v-layout>



  </v-container>
</template>

<script>
import axios from 'axios'
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'

export default {
  data: function () {
    return {
      datetime: '',
      txt: '',
      endpoint: '/admin/roles',
    }
  },

  components: {
    appDateTimePicker: AppDateTimePicker
  },

  methods: {
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
  }
}
</script>

<style>

</style>
