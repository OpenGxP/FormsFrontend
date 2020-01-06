/*
import axios from 'axios'
import store from '@/store'

axios.interceptors.response.use(resp => {
  return resp
}, err => {
  if (err.response.status === 400) {
    store.dispatch('logout')
    return err
  } else {
    console.log('Error: ', err)
    return err
  }
})
*/
