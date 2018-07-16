import Vue from 'vue'
import Vuex from 'vuex'

// setup firebase and db so all components can use
import firebase from 'firebase'
import db from '@/firebase/init'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // user object
    isUserLoggedIn: false,
    stillLoading: true,
    lost_items: null,
    found_items: null,
    firebase,
    db
  },
  mutations: {
    setUser (state, user) {
      state.isUserLoggedIn = true
      state.user = user
    },
    signOut (state) {
      state.isUserLoggedIn = false
      state.user = null
    },
    stillLoading (state, loadingStatus) {
      state.stillLoading = loadingStatus
    },
    setLostItems (state, documents) {
      state.lost_items = documents
    },
    setFoundItems (state, documents) {
      state.found_items = documents
    }
  },
  actions: {
    setUser ({commit}, user) {
      commit('setUser', user)
    },
    signOut ({commit}) {
      commit('signOut')
    },
    stillLoading ({commit}, loadingStatus) {
      commit('stillLoading', loadingStatus)
    },
    setLostItems ({commit}, documents) {
      commit('setLostItems', documents)
    },
    setFoundItems ({commit}, documents) {
      commit('setFoundItems', documents)
    }
  }
})
