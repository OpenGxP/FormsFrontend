import masterdataApi from '@/services/api/masterdata'

const state = {

}

const getters = {

}

const actions = {
  createNewObject (endpoint, payload) {
    masterdataApi.createNewMasterData(endpoint, payload)
      .then(resp => {
        return resp
      })
      .catch(err => {
        return err
      })
  },

  createNewObjectVersion (endpoint, payload) {
    masterdataApi.createNewMasterDataVersion(endpoint, payload)
  },

  updateObject (endpoint, payload) {
    masterdataApi.patchMasterData(endpoint, payload)
  },

  updateObjectStatus (endpoints, status) {
    if (Array.isArray(endpoints)) {
      for (let endpoint of endpoints) {
        masterdataApi.patchMasterDataStatus(endpoint.type, endpoint.version, status)
      }
    } else {
      masterdataApi.patchMasterDataStatus(endpoints.type, endpoints.version, status)
    }
  },

  deleteObject (endpoints) {
    if (Array.isArray(endpoints)) {
      for (let endpoint of endpoints) {
        masterdataApi.deleteMasterData(endpoint)
      }
    } else {
      masterdataApi.deleteMasterData(endpoints)
    }
  }
}

const mutations = {

}

export default {
  state,
  getters,
  actions,
  mutations
}
