import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Home from '@/views/Home.vue'
import Login from '@/views/authentication/Login'
import RecoverAccount from '@/views/authentication/RecoverAccount'
import NewPassword from '@/views/authentication/NewPassword'
import Logs from '@/views/logs/Logs'
import LogInstance from '@/views/logs/LogInstance'
import Test from '@/views/Test'
import TestPermissions from '@/views/TestPermissions'
import MasterData from '@/views/administration/MasterData'
import MasterDataInstance from '@/views/administration/MasterDataInstance'
import UserDetails from '@/views/administration/UserDetails'
import NotFound from '@/components/404.vue'
import zz from '@/views/zz'
import Profile from '@/views/Profile'
import Current from '@/views/Test22'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const ifPermitted = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    if (1!=1) {
      next('/')
      return
    }
  }
  next('/login')
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/md',
      name: 'masterData',
      component: MasterData,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: ':instance',
          name: 'mdInstance',
          component: MasterDataInstance,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'user/:id',
          name: 'mdUserDetails',
          component: UserDetails,
          beforeEnter: ifAuthenticated
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/newpassword',
      name: 'newPassword',
      component: NewPassword
    },
    {
      path: '/recoveraccount',
      name: 'recoverAccount',
      component: RecoverAccount
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: ':instance',
          name: 'logInstance',
          component: LogInstance,
          beforeEnter: ifAuthenticated
        }
      ]
    },
    {
      path: '/testpermissions',
      name: 'TestPermissions',
      component: TestPermissions,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/zz',
      component: zz
    },
    {
      path: '/test22',
      component: Current
    },
    { path: '*',
      component: NotFound
    }
  ]
})
