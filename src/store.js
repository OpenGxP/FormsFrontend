import Vue from 'vue'
import Vuex from 'vuex'
import auth from './store/modules/auth'
import initialize from './store/modules/initialize'
import user from './store/modules/user'
import permission from './store/modules/permission'
import role from './store/modules/role'
import logs from './store/modules/logs'
import masterdata from './store/modules/masterdata'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },

  modules: {
    auth,
    masterdata,
    initialize,
    logs,
    user,
    permission,
    role
  }
})
