import axios from 'axios'

export function newEntry (context, payload) {
  axios.put(`/$(context)`, {
    payload
  })
}

export function changeEntry (context, id, version, payload) {
  axios.put(`/$(context)/$(id)/$(version)`, {
    payload
  })
}

export function deleteEntry (context, id) {
  axios.delete(`/$(context)/$(id)`)
}

export function getEntry (context, id, version) {
  axios.get(`/$(context)/$(id)/$(version)`)
}
