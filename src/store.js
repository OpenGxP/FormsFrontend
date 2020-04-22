import Vue from 'vue'
import Vuex from 'vuex'
import auth from './store/modules/auth'
import authentication from './store/modules/authentication'
import initialize from './store/modules/initialize'
import configuration from './store/modules/configuration'
import user from './store/modules/user'
import inbox from './store/modules/inbox'
import permission from './store/modules/permission'
import role from './store/modules/role'
import logs from './store/modules/logs'
import masterdata from './store/modules/masterdata'
// import snackbar from './store/modules/snackbar'
import session from './store/modules/session'
import global from './store/modules/global'
import user2 from './store/modules/user/user'

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
    authentication,
    masterdata,
    initialize,
    configuration,
    logs,
    user,
    permission,
    role,
    session,
    inbox,
    global,
    user2
  }
})
