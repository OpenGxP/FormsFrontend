import axios from 'axios'

// object literal
export default {
  login (credentials) {
    return axios({
      method: 'POST',
      url: '/login',
      data: {
        'username': credentials.username,
        'password': credentials.password
      },
      withCredentials: true
    })
  },

  // can be requested when user was successfully authenticated in backend
  getToken () {
    return axios({
      method: 'GET',
      url: '/csrftoken',
      withCredentials: true
    })
  },

  logout () {
    return axios({
      method: 'GET',
      url: '/logout',
      withCredentials: true
    })
  }
}
