import { mode } from './config'

const state = {
  active: false,
  options: mode,
  default: mode.info,
  mode: mode.info,
  text: ''
}

const getters = {
  active: (state) => state.active,
  options: (state) => state.options,
  mode: (state) => state.mode,
  text: (state) => state.text
}

const actions = {
  show: ({ commit }) => {
    commit('show')
  },
  hide: ({ commit }) => {
    commit('hide')
  },
  toggle: ({ commit }) => {
    commit('toggle')
  },
  setMode: ({ commit }, payload) => {
    commit('setMode', payload)
  },
  resetMode: ({ commit }) => {
    commit('resetMode')
  },
  activate: ({ commit }, payload) => {
    commit('setMode', payload.mode)
    commit('setText', payload.text)
    commit('show')
  }
}

const mutations = {
  show: (state) => {
    state.active = true
  },
  hide: (state) => {
    state.active = false
  },
  toggle: (state) => {
    state.active = !state.active
  },
  setMode: (state, payload) => {
    state.mode = mode[payload]
  },
  resetMode: (state) => {
    state.mode = state.default
  },
  setText: (state, payload) => {
    state.text = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
