import { LOAD_ROLES } from '../actions/role'
import axios from 'axios'

const state = {
  roles: []
}

const getters = {
  roles: (state) => state.roles,
  validRoles: (state) => {
    const validRoles = state.roles.map(role => {
      if (role.valid === true) {
        return role
      }
    })
    return validRoles
  }
}

const actions = {
  [LOAD_ROLES]: ({ commit }) => {
    axios.get('/admin/roles')
      .then(resp => {
        const _roles = resp.data
        // create permissions array [{key: name}, ...]
        commit(LOAD_ROLES, _roles)
      })
  }
}

const mutations = {
  [LOAD_ROLES]: (state, payload) => {
    state.roles = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
