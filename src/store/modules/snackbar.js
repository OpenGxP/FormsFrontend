const state = {
  active: false,
  snackOptions: {
    color: 'primary',
    mode: 'multi-line',
    timeout: 3000,
    message: 'Test!',
    y: 'top'
    // x: 'left'
  },
  snackDefaultOptions: {
    color: 'primary',
    mode: 'multi-line',
    timeout: 3000,
    message: 'Message',
    y: 'top'
  }
}

const getters = {
  isActive: (state) => state.active,
  snackOptions: (state) => state.snackOptions
}

const actions = {
  show: ({ commit }) => {
    commit('show')
  },
  hide: ({ commit }) => {
    commit('hide')
  },
  setActive: ({ commit }, payload) => {
    commit('setActive')
  },
  setOptions: ({ commit }, payload) => {
    commit('setOptions', payload)
  },
  resetOptions: ({ commit }) => {
    commit('resetOptions')
  }
}

const mutations = {
  show: (state) => {
    state.active = true
  },
  hide: (state) => {
    state.active = false
  },
  setActive: (state, payload) => {
    state.active = payload
  },
  setOptions: (state, payload) => {
    state.snackOptions = { ...state.snackOptions, ...payload }
  },
  resetOptions: (state) => {
    state.snackOptions = state.snackDefaultOptions
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
