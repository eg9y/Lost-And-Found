import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
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
      path: '/database',
      name: 'Database',
      component: Database
    },
  ]
})
