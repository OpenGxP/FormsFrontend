import axios from 'axios'
import router from '@/router'
import ability from '@/ability'
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
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: '/login',
        data: user,
        withCredentials: true
      })
        .then(resp => {
          dispatch('getToken')
          // dispatch('initialize')
          dispatch(USER_REQUEST, {
            'user': user,
            'permissions': resp.data
          })
          ability.update(resp.data.casl)
          resolve(resp)
        })
        .catch(err => {
          commit('failedAttempt', err.response.data)
          reject(err)
        })
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
  },
  setNewPassword: ({ commit }, credentials) => {
    axios.patch('fwadad', credentials)
      .then(resp => {})
      .catch(err => {})
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
