import Vue from 'vue'
import App from './App.vue'
import { abilitiesPlugin } from '@casl/vue'
import router from './router'
import store from './store'
import ability from './ability'
import './registerServiceWorker'
import axios from 'axios'
import vuelidate from 'vuelidate'
import { heartbeat } from './helpers/heartbeat'

import vuetify from './plugins/vuetify'

/*
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
*/

Vue.config.productionTip = false

/*
const opts = {
  icons: {
    iconfont: 'md'
  }
}
Vue.use(Vuetify)
*/

// configure casl
Vue.use(abilitiesPlugin, ability)

// vuelidate
Vue.use(vuelidate)

// configure axios
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8000' // https://staging.opengxp.com/api
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
// heartbeat()

new Vue({
  vuetify,
  router,
  store,
  ability,
  render: h => h(App)
}).$mount('#app')
