import axios from 'axios'
import router from '@/router'
import { USER_REQUEST } from '../actions/user'

const state = {
  auth: false,
  token: '',
  errMsg: ''
}

const getters = {
  isAuthenticated: (state) => state.auth,
  errMsg: (state) => state.errMsg
}

const actions = {
  login: ({ commit, dispatch }, user) => {
    axios({
      method: 'POST',
      url: '/login',
      data: user,
      withCredentials: true
    })
      .then(resp => {
        commit('login', resp)
        dispatch('getToken')
        commit(USER_REQUEST, user)
        router.push('/')
      })
      .catch(err => {
        commit('failedAttempt', err.response.data)
      })
  },
  logout: ({ commit }) => {
    axios({
      method: 'GET',
      url: '/logout',
      withCredentials: true
    })
      .then(resp => {
        commit('logout')
        commit('setToken', '')
        router.push('/login')
      })
  },
  lo: ({ commit }) => {
    console.log('executed')
    commit('logout')
    router.push('/login')
  },
  getToken: ({ commit }) => {
    axios({
      method: 'GET',
      url: '/csrftoken',
      withCredentials: true
    })
      .then(resp => {
        const token = resp.data.csrftoken
        axios.defaults.headers.common = {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFTOKEN': token
        }
        commit('setToken', token)
      })
  }
}

const mutations = {
  login: (state) => {
    state.auth = true
  },
  failedAttempt: (state, msg) => {
    state.errMsg = msg
  },
  logout: (state) => {
    if (state.token) {
      state.token = ''
    }
    state.auth = false
  },
  setToken: (state, token) => {
    state.token = token
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
