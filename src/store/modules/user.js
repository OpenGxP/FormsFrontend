import { USER_REQUEST, USER_PERMISSIONS } from '../actions/user'

const state = {
  currentUser: '',
  myPermissions: []
}

const getters = {
  currentUser: (state) => state.currentUser
}

const actions = {
  [USER_REQUEST]: ({ commit }, payload) => {
    commit(USER_REQUEST, payload.user)
    commit(USER_PERMISSIONS, payload.permissions)
  },
  [USER_PERMISSIONS]: ({ commit }, payload) => {
    commit(USER_PERMISSIONS, payload)
  }
}

const mutations = {
  [USER_REQUEST]: (state, user) => {
    state.currentUser = user.username
  },
  [USER_PERMISSIONS]: (state, permissions) => {
    state.myPermissions = permissions
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
