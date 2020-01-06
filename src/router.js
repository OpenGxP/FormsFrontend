import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Home from '@/views/Home.vue'
import Login from '@/views/authentication/Login'
import RecoverAccount from '@/views/authentication/RecoverAccount'
import VerifyAccount from '@/views/authentication/VerifyAccount'
import NewPassword from '@/views/authentication/NewPassword'
import Logs from '@/views/logs/Logs'
import LogInstance from '@/views/logs/LogInstance'
import Test from '@/views/Test'
import Calendar from '@/views/Calendar'
import MasterData from '@/views/administration/MasterData'
import MasterDataInstance from '@/views/administration/MasterDataInstance'
import NotFound from '@/components/404.vue'
import filter from '@/views/filter'
import Profile from '@/views/Profile'
import Inbox from '@/views/Inbox'

import Category from '@/views/test/Category'

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
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/admin',
      name: 'masterData',
      component: MasterData,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: ':instance',
          name: 'mdInstance',
          component: MasterDataInstance,
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
      path: '/password_reset_email/:token',
      name: 'verifyAccount',
      component: VerifyAccount
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
      path: '/filter',
      component: filter
    },
    {
      path: '/api/:category',
      name: 'Category',
      component: Category,
      props: true,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: ':instance',
          name: 'Instance',
          component: MasterDataInstance,
          props: true,
          beforeEnter: ifAuthenticated
        }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
