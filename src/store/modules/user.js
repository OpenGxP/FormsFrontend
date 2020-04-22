import { USER_REQUEST, USER_PERMISSIONS } from '../actions/user'
import axios from 'axios'
import vuetify from '@/plugins/vuetify'

const state = {
  currentUser: '',
  myPermissions: [],
  initialPassword: true,
  initialTimezone: true,
  timezone: '',
  language: '',
  darkTheme: 'Yes',
  tableSettings: {
    dense: false,
    pagination: 25
  }
}

const getters = {
  currentUser: (state) => state.currentUser,
  initialPassword: (state) => state.initialPassword,
  initialTimezone: (state) => state.initialTimezone,
  timezone: (state) => state.timezone,
  lang: (state) => state.language,
  tableSettings: (state) => state.tableSettings,
  darkTheme: (state) => state.darkTheme
}

const actions = {
  initUser: ({ commit }) => {
    axios.get('/user/profile')
      .then(resp => {
        const dense = resp.data.results.find(entry => entry.key === 'gui.dense').value
        const pagination = resp.data.results.find(entry => entry.key === 'gui.pagination').value
        commit('setTimezone', resp.data.results.find(entry => entry.key === 'loc.timezone').value)
        commit('setLang', resp.data.results.find(entry => entry.key === 'loc.language').value)
        commit('setTheme', resp.data.results.find(entry => entry.key === 'gui.darkmode').value)
        commit('setTableSettings', { 'dense': dense, 'pagination': pagination })
      })
  },
  [USER_REQUEST]: ({ commit }, payload) => {
    commit(USER_REQUEST, payload.user)
    commit(USER_PERMISSIONS, payload.permissions)
  },
  [USER_PERMISSIONS]: ({ commit }, payload) => {
    commit(USER_PERMISSIONS, payload)
  },
  setInitialAttributeState: ({ commit }, payload) => {
    commit('setInitialAttributeState', payload)
  },
  setTimezone: ({ commit }, payload) => {
    commit('setTimezone', payload)
  },
  setLang: ({ commit }, payload) => {
    axios.patch('/user/profile/loc.language', payload)
      .then(commit('setLang', payload))
  },
  setTableSettings: ({ commit }, payload) => {
    commit('setTableSettings', payload)
  },
  setTheme: ({ commit }, payload) => {
    commit('setTheme', payload)
  }
}

const mutations = {
  [USER_REQUEST]: (state, user) => {
    state.currentUser = user.username
  },
  [USER_PERMISSIONS]: (state, permissions) => {
    state.myPermissions = permissions
  },
  setTimezone: (state, payload) => {
    state.timezone = payload
  },
  setLang: (state, payload) => {
    state.language = payload
  },
  setInitialAttributeState: (state, payload) => {
    state.initialPassword = payload.initialPassword
    state.initialTimezone = payload.initialTimezone
  },
  setTheme: (state, payload) => {
    if (payload === 'Yes') {
      state.darkTheme = true
      vuetify.framework.theme.dark = true
    } else {
      state.darkTheme = false
      vuetify.framework.theme.dark = false
    }
  },
  setTableSettings: (state, payload) => {
    state.tableSettings.dense = payload.dense === 'Yes'
    state.tableSettings.pagination = payload.pagination
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
