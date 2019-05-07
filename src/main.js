import Vue from 'vue'
import './plugins/vuetify'
// import { abilitiesPlugin } from '@casl/vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { heartbeat } from './helpers/heartbeat'

Vue.config.productionTip = false
// Vue.use(abilitiesPlugin, ability)

// https://stating.opengxp.com/api
axios.defaults.baseURL = 'http://127.0.0.1:8000'
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
  render: h => h(App)
}).$mount('#app')
