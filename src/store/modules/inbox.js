import axios from 'axios'

const state = {
  inboxItems: 0
}

const getters = {
  inboxItems: (state) => state.inboxItems,
  activeItems: (state) => state.inboxItems !== 0
}

const actions = {
  updateInbox: ({ commit }) => {
    axios
      .get('/user/inbox/notifications')
      .then(resp => {
        commit('updateInbox', resp.data.notifications)
      })
  }
}

const mutations = {
  updateInbox: (state, payload) => {
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
