const state = {
  table: {
    dense: false
  }
}

const getters = {
  table: (state) => state.table,
  dense: (state) => state.table.dense
}

const actions = {
  setTable: ({ commit }, payload) => {
    commit('setTable', payload)
  }
}

const mutations = {
  setTable: (state, payload) => {
    state.table = { ...state.table, ...payload }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
