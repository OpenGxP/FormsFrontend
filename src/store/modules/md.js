const state = {
  md: {}
}

const getters = {
  masterData: (state) => state.md
}

const actions = {
  save: ({ commit }, payload) => {
    commit('save', payload)
  }
}

const mutations = {
  save: (state, payload) => {
    state.md = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
