// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// Import vue-progressive-image for progressive image loading
import VueProgressiveImage from 'vue-progressive-image'
// Setup router
import router from './router'
import VueRouter from 'vue-router'
// Setup vuex
import store from '@/store/store'
import { sync } from 'vuex-router-sync'
// Setup vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// Setup google maps
import * as VueGoogleMaps from 'vue2-google-maps'
// Import global component Panel ('window' component)
import Panel from '@/components/globals/Panel'

Vue.component('panel', Panel)

// Setup event bus to be exported. Allows child component to talk
// with parent component
export const EventBus = new Vue()

sync(store, router)
// Ensure you are using css-loader
Vue.use(VueRouter)

Vue.use(Vuetify, {
  theme: {
    primary: '#1C77C3',
    accent: '#39A9DB'
  }
})

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAPS_API,
    // This is required if you use the Autocomplete plugin
    libraries: 'places'
  },
  autobindAllEvents: false
})

Vue.use(VueProgressiveImage)

// Development mode
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
