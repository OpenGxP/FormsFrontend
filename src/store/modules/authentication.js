import axios from 'axios'
import authApi from '@/services/api/authentication'
import ability from '@/ability'
import router from '@/router'

const state = {
  isAuthenticated: false,
  token: ''
}

const getters = {
  isAuthenticated: state => state.isAuthenticated
}

const actions = {
  authenticationAtttempt ({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      authApi.login(credentials)
        .then(resp => {
          // get auth token
          dispatch('getToken')
          // set user attributes
          dispatch('setInitialAttributeState', {
            'initialPassword': resp.data.initial_password,
            'initialTimezone': resp.data.initial_timezone
          }, { root: true })
          commit('user2/setUsername', credentials.username, { root: true })
          // update casl permissions
          ability.update(resp.data.casl)
          resolve(resp)
        })
        .catch(err => {
          if (err.response.status === 403) {
            // replace old token
            dispatch('getToken')
            setTimeout(reject(err), 1000)
          } else {
            reject(err)
          }
        })
    })
  },
  login () {
    //
  },
  getToken ({ commit }) {
    authApi.getToken()
      .then(resp => {
        commit('setToken', resp.data.csrftoken)
      })
      .catch()
  },
  logout ({ commit }) {
    authApi.logout()
      .then(resp => {
        commit('logout')
        router.push('/login')
      })
  }
}

const mutations = {
  login (state) {
    state.isAuthenticated = true
  },
  setToken (state, token) {
    axios.defaults.headers.common = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFTOKEN': token
    }
    state.token = token
  },
  logout (state) {
    state.isAuthenticated = false
    state.token = ''
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
