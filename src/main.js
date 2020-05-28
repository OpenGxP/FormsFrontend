import Vue from 'vue'
import App from './App.vue'
import { abilitiesPlugin } from '@casl/vue'
import router from './router'
import store from './store'
import ability from './ability'
import axios from 'axios'
import vuelidate from 'vuelidate'
import VueHotkey from 'v-hotkey'
import { heartbeat } from './helpers/heartbeat'
import { newsfeed } from './helpers/newsfeed'

import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// configure casl
Vue.use(abilitiesPlugin, ability)

// vuelidate
Vue.use(vuelidate)

// hotkeys
Vue.use(VueHotkey)

// configure axios
Vue.prototype.$http = axios;
(async () => {
  const res = await fetch('./runtimeEndpoint.json')
  const json = await res.json()
  axios.defaults.baseURL = json.endpoint
})()
axios.defaults.withCredentials = true

// interceptors
axios.interceptors.response.use(resp => {
  return resp
}, err => {
  if (err.response.status === 401) {
    store.dispatch('lo')
    // return Promise.reject(err)
  } else {
    return Promise.reject(err)
  }
})

// constant polling
heartbeat()
newsfeed()

new Vue({
  vuetify,
  router,
  store,
  ability,
  render: h => h(App)
}).$mount('#app')
