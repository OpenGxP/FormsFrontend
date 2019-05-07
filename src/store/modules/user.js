import { USER_REQUEST } from '../actions/user'

const state = {
  currentUser: ''
}

const getters = {
  currentUser: (state) => state.currentUser
}

const actions = {
  [USER_REQUEST]: ({ commit }, user) => {
    commit(USER_REQUEST, user)
  }
}

const mutations = {
  [USER_REQUEST]: (state, user) => {
    state.currentUser = user.username
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
