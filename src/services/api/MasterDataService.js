import axios from 'axios'

// get data
export function test () {
  axios.get('')
}

export function test2 (payload) {
  axios.put('', { payload })
}

export function test3 (payload) {
  axios.post('', { payload })
}
