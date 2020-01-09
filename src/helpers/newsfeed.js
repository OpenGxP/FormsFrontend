import store from '../store'

export function newsfeed () {
  if (store.getters.isAuthenticated) {
    store.dispatch('updateInbox')
  }
  setTimeout(newsfeed, 5000)
}
