import axios from 'axios'

const state = {
  baseConfiguration: []
}

const getters = {
  data: (state) => state.baseConfiguration.navigation
  /*
  logs: (state) => state.baseConfiguration.navigation.logs,
  user: (state) => state.baseConfiguration.user
  */
}

const actions = {
  get: ({ commit, dispatch }) => {
    axios.get('/_root')
      .then(resp => {
        commit('get', resp.data)
      })
  }
}

const mutations = {
  get: (state, payload) => {
    state.baseConfiguration = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
