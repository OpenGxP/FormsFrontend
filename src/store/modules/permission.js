import { LOAD_PERMISSIONS } from '../actions/permission'
import axios from 'axios'

const state = {
  permissions: []
}

const getters = {
  permissions: (state) => state.permissions
}

const actions = {
  [LOAD_PERMISSIONS]: ({ commit }) => {
    axios({
      method: 'get',
      url: '/admin/permissions'
    })
      .then(resp => {
        const _permissions = resp.data
        // create permissions array [{key: name}, ...]
        const permissions = _permissions.map((permission) => {
          return { [permission.key]: `${permission.model} - ${permission.permission}` }
        })
        commit(LOAD_PERMISSIONS, permissions)
      })
  }
}

const mutations = {
  [LOAD_PERMISSIONS]: (state, payload) => {
    state.permissions = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
