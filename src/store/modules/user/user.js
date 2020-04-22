import userApi from '@/services/api/user'

const state = {
  username: '',
  permissios: [],
  initialPassword: true,
  initialTimezone: true,
  timezone: '',
  language: '',
  profile: {
    'gui.darkmode': 'Yes',
    'gui.dense': 'Yes',
    'gui.pagination': 25,
    'loc.language': 'en_EN',
    'loc.timezone': 'UTC'
  }
}

const getters = {
  username: (state) => state.username,
  initialPassword: (state) => state.initialPassword,
  initialTimezone: (state) => state.initialTimezone,
  timezone: (state) => state.timezone,
  language: (state) => state.language,
  profile: (state) => state.profile
}

const actions = {
  // authentication stuff
  changePassword ({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      userApi.userChangePassword(credentials)
        .then(resp => { resolve(resp) })
        .catch(err => { reject(err) })
    })
  },

  // profile stuff
  getProfileData ({ commit }) {
    userApi.userGetProfile()
      .then(resp => {
        for (let item of resp.data.results) {
          commit('changeProfile', { [item.key]: item.value })
        }
      })
  },
  getProfileMeta () {
    return new Promise((resolve, reject) => {
      userApi.userGetProfileMeta()
        .then(resp => { resolve(resp) })
        .catch(err => { reject(err) })
    })
  },
  /*
  changeTimezone ({ commit, dispatch }, timezone) {
    return new Promise((resolve, reject) => {
      userApi.userPatchTimezone(timezone)
        .then(resp => { resolve(resp) })
        .catch(err => { reject(err) })
    })
  },
  */
  getTimezoneMeta () {
    return new Promise((resolve, reject) => {
      userApi.userGetTimezoneMeta()
        .then(resp => { resolve(resp) })
        .catch(err => { reject(err) })
    })
  },
  changeTimezone ({ commit, dispatch }, timezone) {
    return new Promise((resolve, reject) => {
      userApi.userPatchTimezone(timezone)
        .then(resp => { resolve(resp) })
        .catch(err => { reject(err) })
    })
  }
}

const mutations = {
  setUsername (state, username) {
    state.username = username
  },
  changeProfile (state, payload) {
    state.profile = payload
  },
  changeGuiDarkmode (state, payload) {
    state.profile['gui.darkmode'] = payload
  },
  changeGuiPagination (state, payload) {
    state.profile['gui.pagination'] = payload
  },
  changeGuiDense (state, payload) {
    state.profile['gui.dense'] = payload
  },
  changeLocTimezone (state, payload) {
    state.profile['loc.timezone'] = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
