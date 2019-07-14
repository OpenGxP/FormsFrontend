import axios from 'axios'
import router from '@/router'

import { INIT_MASTERDATA } from '../actions/masterdata'
import { INIT_LOGS } from '../actions/logs'

const state = {
  loaded: false
}

const getters = {
  loaded: (state) => state.loaded
}

const actions = {
  initialize: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      console.log('initialize')
      axios.get('/')
        .then(resp => {
          const payload = resp.data
          commit(INIT_MASTERDATA, payload.administration)
          commit(INIT_LOGS, payload.logs)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

const mutations = {
  initialize: (state) => {
    state.loaded = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
