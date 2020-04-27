import store from '../store'

export function newsfeed () {
  if (store.getters.isAuthenticated) {
    store.dispatch('inbox/updateInbox')
  }
  setTimeout(newsfeed, 5000)
}
