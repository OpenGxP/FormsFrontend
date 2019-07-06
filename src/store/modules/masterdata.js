import { ACTIVATE_DIALOG_MASTERDATA, INIT_MASTERDATA, NEW_MASTERDATA, EDIT_MASTERDATA, DELETE_MASTERDATA, NEWV_VERSION_MASTERDATA, STATE_CHANGE_MASTERDATA, LOAD_DATA_MASTERDATA, LOAD_META_MASTERDATA, RELOAD_MASTERDATA } from '../actions/masterdata'
import axios from 'axios'

const state = {
  masterData: [],
  ep: [],
  instanceItems: [{
    permissions: '01.01',
    role: 'Hans',
    status: 'productive',
    unique: 'cd75efad-966e-4cdb-ad14-729405f82de3_1',
    valid: true,
    valid_from: '2019-05-19T11:02:07.791449Z',
    valid_to: null,
    version: 1
  }],
  instanceHeaders: [
    { text: 'Role', value: 'role' },
    { text: 'Permissions', value: 'permissions' },
    { text: 'Valid from', value: 'valid_from' },
    { text: 'Valid to', value: 'valid_to' },
    { text: 'status', value: 'status' },
    { text: 'version', value: 'version' }
  ],
  instanceMeta: {},
  instanceDialog: false
}

const getters = {
  masterData: (state) => state.masterData,
  ep: (state) => state.ep,
  instanceItems: (state) => state.instanceItems,
  instanceHeaders: (state) => state.instanceHeaders,
  instanceMeta: (state) => state.instanceMeta
}

const actions = {
  [INIT_MASTERDATA]: ({ commit }, payload) => {
    commit(INIT_MASTERDATA, payload)
  },
  [NEW_MASTERDATA]: ({ commit }, endpoint, payload) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: endpoint,
        data: payload,
        withCredentials: true
      })
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [EDIT_MASTERDATA]: ({ commit }, endpoint, payload) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'patch',
        url: endpoint,
        data: payload,
        withCredentials: true
      })
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [DELETE_MASTERDATA]: ({ commit }, payload) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: payload.endpoint
      })
        .then(resp => {
          commit(DELETE_MASTERDATA, payload.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [NEWV_VERSION_MASTERDATA]: ({ commit }, endpoint) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: endpoint,
        withCredentials: true
      })
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [STATE_CHANGE_MASTERDATA]: ({ commit }, endpoint) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'patch',
        url: endpoint
      })
        .then(resp => {
          commit(STATE_CHANGE_MASTERDATA, resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [LOAD_META_MASTERDATA]: ({ commit }, endpoint) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: endpoint
      })
        .then(resp => {
          commit(LOAD_META_MASTERDATA, resp.data.get)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [LOAD_DATA_MASTERDATA]: ({ commit, state }, endpoint) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: endpoint
      })
        .then(resp => {
          const meta = Object.assign({}, state.instanceMeta)
          // test if resp is empty
          const _headers = []
          if (resp.data[0]) {
            for (let key of Object.keys(resp.data[0])) {
              // TODO: geisteskranken Fehler fixen
              if (!meta[key]['render']) {
                meta[key]['render'] = false
              }
              if (meta[key]['render'] === true) {
                _headers.push({
                  'value': key,
                  'text': meta[key]['verbose_name']
                })
              }
            }
          }
          commit(LOAD_DATA_MASTERDATA, {
            'items': resp.data,
            'headers': _headers
          })
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [RELOAD_MASTERDATA]: ({ commit }, endpoint) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: endpoint
      })
        .then(resp => {
          commit(RELOAD_MASTERDATA, resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  [ACTIVATE_DIALOG_MASTERDATA]: ({ commit }, endpoint) => {
    commit(ACTIVATE_DIALOG_MASTERDATA)
  }
}

const mutations = {
  [INIT_MASTERDATA]: (state, payload) => {
    state.masterData = Object.keys(payload.subjects)
    state.ep = Object.keys(payload.subjects).map(ep => `${payload.root}${ep}`)
  },
  [DELETE_MASTERDATA]: (state, payload) => {
    state.instanceItems = state.instanceItems.filter(obj => obj.unique !== payload.unique)
  },
  [STATE_CHANGE_MASTERDATA]: (state, payload) => {
    state.instanceItems = state.instanceItems.map(obj => {
      if (obj.unique === payload.unique) return payload
      return obj
    })
  },
  [LOAD_META_MASTERDATA]: (state, payload) => {
    state.instanceMeta = payload
  },
  [LOAD_DATA_MASTERDATA]: (state, payload) => {
    state.instanceHeaders = payload.headers
    state.instanceItems = payload.items
  },
  [RELOAD_MASTERDATA]: (state, payload) => {
    state.instanceItems = payload
  },
  [ACTIVATE_DIALOG_MASTERDATA]: (state, payload) => {
    state.instanceDialog = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
