import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import Auth from '@/components/auth/Auth'
import Database from '@/components/database/Database'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GMap',
      component: GMap
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/database',
      name: 'Database',
      component: Database
    },
  ]
})
