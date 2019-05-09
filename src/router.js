import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Home from '@/views/Home.vue'
import Login from '@/views/authentication/Login.vue'
import Users from '@/views/administration/Users'
import Permissions from '@/views/administration/Permissions'
import Roles from '@/views/administration/Roles'
import Ldap from '@/views/administration/Ldap'
import AccessLog from '@/views/logs/AccessLog'
import CentralLog from '@/views/logs/CentralLog'
import PermissionLog from '@/views/logs/PermissionLog'
import RoleLog from '@/views/logs/RoleLog'
import UserLog from '@/views/logs/UserLog'
import Administration from '@/views/administration/Administration'
import Test from '@/views/Test'

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
  mode: 'history',
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
      path: '/settings',
      name: 'settings',
      component: Administration,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/permissions',
      name: 'permissions',
      component: Permissions,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/roles',
      name: 'roles',
      component: Roles,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/ldap',
      name: 'ldap',
      component: Ldap,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/logs/access',
      name: 'AccessLog',
      component: AccessLog,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/logs/central',
      name: 'CentralLog',
      component: CentralLog,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/logs/permissions',
      name: 'PermissionLog',
      component: PermissionLog,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/logs/roles',
      name: 'RoleLog',
      component: RoleLog,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/logs/users',
      name: 'UserLog',
      component: UserLog,
      beforeEnter: ifAuthenticated
    }
  ]
})
