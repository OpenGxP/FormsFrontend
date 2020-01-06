import axios from 'axios'
// import { GET_INBOX } from '../actions/session'

const state = {
  table: {
    dense: false
  },
  inboxItems: 0
}

const getters = {
  table: (state) => state.table,
  dense: (state) => state.table.dense,
  inboxItems: (state) => state.inboxItems
}

const actions = {
  setTable: ({ commit }, payload) => {
    commit('setTable', payload)
  },
  getInbox: ({ commit }) => {
    axios({
      method: 'GET',
      url: '/user/inbox',
      withCredentials: true
    })
      .then(resp => {
        const payload = resp.data.results
        if (payload) commit('setInbox', payload.length)
      })
  }
}

const mutations = {
  setTable: (state, payload) => {
    state.table = { ...state.table, ...payload }
  },
  setInbox: (state, payload) => {
    state.inboxItems = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
