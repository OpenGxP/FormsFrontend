import axios from 'axios'
import Vue from 'vue'

const baseURL = `http://henrik.com:8000/`

const authInstance = axios.create({
  baseURL: baseURL,
  /*
  headers: {
    // header data goes here
  },
  */
  withCredentials: true
})

Vue.prototype.$auth = authInstance
