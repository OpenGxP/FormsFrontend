import Vue from 'vue'
import Vuex from 'vuex'
import auth from './store/modules/auth'
import user from './store/modules/user'
import permission from './store/modules/permission'
import role from './store/modules/role'

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
    user,
    permission,
    role
  }
})
