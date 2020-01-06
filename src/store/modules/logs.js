import { INIT_LOGS } from '../actions/logs'

const state = {
  logs: [],
  endpoints: []
}

const getters = {
  endpoints: (state) => state.endpoints,
  logs: (state) => state.logs,
  authenticatedLogs: (state) => state.logs
}

const actions = {
  [INIT_LOGS]: ({ commit }, payload) => {
    commit(INIT_LOGS, payload)
  }
}

const mutations = {
  getLogs: (state, endpoints) => {
    state.endpoints = endpoints
  },
  [INIT_LOGS]: (state, payload) => {
    state.logs = Object.keys(payload.subjects)
    state.endpoints = Object.keys(payload.subjects).map(ep => `${payload.root}${ep}`)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
