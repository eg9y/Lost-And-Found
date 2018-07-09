import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import Database from '@/components/database/Database'
import LostForm from '@/components/add-lost-item/LostForm'
import FoundForm from '@/components/add-found-item/FoundForm'

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
    {
      path: '/add-lost-item',
      name: 'LostForm',
      component: LostForm
    },
    {
      path: '/add-found-item',
      name: 'FoundForm',
      component: FoundForm
    }
  ]
})
