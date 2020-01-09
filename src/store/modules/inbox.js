import axios from 'axios'

const state = {
  inboxItems: 0
}

const getters = {
  inboxItems: (state) => state.inboxItem,
  activeItems: (state) => state.inboxItems !== 0
}

const actions = {
  updateInbox: ({ commit }) => {
    axios
      .get('/user/inbox')
      .then(resp => {
        commit('updateInbox', resp.data.count)
      })
  }
}

const mutations = {
  updateInbox: (state, payload) => {
    state.inboxItems = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
