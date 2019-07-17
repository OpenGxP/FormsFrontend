import Vue from 'vue'
import './plugins/vuetify'
import { abilitiesPlugin } from '@casl/vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ability from './ability'
import axios from 'axios'
import { heartbeat } from './helpers/heartbeat'

Vue.config.productionTip = false
Vue.use(abilitiesPlugin, ability)

axios.defaults.baseURL = https://staging.opengxp.com/api
axios.defaults.withCredentials = true

// interceptors
axios.interceptors.response.use(resp => {
  return resp
}, err => {
  if (err.response.status === 403) {
  } else if (err.response.status === 401) {
    store.dispatch('lo')
    // return Promise.reject(err)
  } else {
    return Promise.reject(err)
  }
})

// heartbeat
heartbeat()

new Vue({
  router,
  store,
  ability,
  render: h => h(App)
}).$mount('#app')
