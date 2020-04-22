import axios from 'axios'

// object literal
export default {
  // GET
  getMasterData (type, queryString) {
    return axios.get(`/${type}/${queryString}`)
      .then(response => {
        return response.data
      })
  },

  createNewMasterData (type, payload) {
    return axios.post(`${type}`, payload)
  },

  createNewMasterDataVersion (type, version) {
    return axios.post(`/${type}/${version}`)
  },

  patchMasterData (type, version, payload) {
    return axios.post(`/${type}/${version}`, payload)
  },

  patchMasterDataStatus (type, version, status) {
    return axios.post(`/${type}/${version}/${status}`)
  },
  deleteMasterData (type) {
    return axios.delete(`/${type}`)
  }
}
