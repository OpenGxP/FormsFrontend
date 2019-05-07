import axios from 'axios'
import store from '../store'

export function heartbeat () {
  const interval = 5000
  // var refreshActivity = window.setInterval(checkActivity, interval)
  window.setInterval(checkActivity, interval)

  function checkActivity () {
    setTimeout(response, interval)
    var t = false
    window.onload = setActive
    window.onmousemove = setActive
    window.onmousedown = setActive
    window.ontouchstart = setActive
    window.onclick = setActive
    window.onkeypress = setActive
    window.addEventListener('scroll', setActive, true)

    function response () {
      if (store.getters.isAuthenticated) {
        axios.patch('/logout_auto', { 'active': t })
      }
    }
    function setActive () {
      t = true
    }
  }
}
