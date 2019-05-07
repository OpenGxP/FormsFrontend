<template>
<v-container grid-list-md text-xs-center>
  <v-layout align-center justify-center row wrap>
    <template v-for="item in settingsData">
      <v-flex xs12 sm6 md6>
        <v-text-field
          :label="item.key"
          v-model="item.value"
          @blur="saveSetting(item.key, item.value)"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="item.value = item.default">Set Default</v-btn>
          </template>
          <span>Default: {{item.default}}</span>
        </v-tooltip>
      </v-flex>
    </template>
  </v-layout>
</v-container>

		<!--<app-settings :items="settingsData"/>-->		          

</template>

<script>
import axios from 'axios'
import AppSettings from '@/components/AppSettings'

export default {
  name: 'Administration',
  components: {
  	appSettings: AppSettings
  },
  data () {
      return {
        testItems: [],
        settingsMeta: {},
        settingsData: []
      }
    },
    methods: {
      getMeta () {
        // meta
        axios({
          method: 'get',
          url: 'meta/settings'
        })
          .then(resp => {
            // transform resp into arry of objects
            const _settings = resp.data.get
            console.log('gugoi ',_settings['key'])
            const settings = []
            for (let key of Object.keys(_settings)) {
              const setting = _settings[key]
              setting['val'] = key
              settings.push(setting)
            }
            this.testItems = settings
            this.settingsMeta = resp.data.get
            console.log('Setting: ',settings)
            this.getData()
          })
      },
      getData () {
        axios({
          method: 'get',
          url: 'admin/settings'
        })
          .then(resp => {
            console.log(resp.data)
            this.settingsData = resp.data
          })
      },
      saveSetting (key, val) {
        axios({
          method: 'patch',
          url: `admin/settings/${key}`,
          data: { value: val }
        })
          .then(resp => {
            console.log(resp.data)
          })
      }
    },
    created () {
      this.getMeta()
    }
}
</script>
