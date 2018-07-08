import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import Auth from '@/components/auth/Auth'

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
    }
  ]
})
