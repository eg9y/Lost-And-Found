import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import Database from '@/components/database/Database'
import Profile from '@/components/Profile/Index'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/:id',
      props: true,
      component: GMap
    }
  ]
})
