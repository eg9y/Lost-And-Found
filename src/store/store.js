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
    all_lost_items: null,
    all_found_items: null,
    firebase,
    db,
    // added by Geoff for toggling between lost/found pins
    lostToggle: true,
    foundToggle: true
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
    },
    setAllLostItems (state, items) {
      state.all_lost_items = items
    },
    setAllFoundItems (state, items) {
      state.all_found_items = items
    },
    // below two functions are for toggling lost/found pins
    setLostToggle (state) {
      state.lostToggle = !state.lostToggle
    },
    setFoundToggle (state) {
      state.foundToggle = !state.foundToggle
    },
    updateCollection (state, collectionName) {
      let documents = []
      state.db
        .collection(collectionName)
        .get()
        .then(items => {
          items.forEach(doc => {
            let dataWithId = doc.data()
            dataWithId.id = doc.id
            // doc.data() is never undefined for query doc snapshots
            documents.push(dataWithId)
          })
          if (collectionName === 'lost-items') {
            state.all_lost_items = documents
          } else {
            state.all_found_items = documents
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    updateUserCollection (state, collectionName) {
      let documents = []
      state.db
        .collection(collectionName)
        .where('userID', '==', state.user.uid)
        .get()
        .then(items => {
          items.forEach(doc => {
            // doc.data() is never undefined for query doc snapshots
            let dataWithId = doc.data()
            dataWithId.id = doc.id
            documents.push(dataWithId)
          })
          if (collectionName === 'lost-items') {
            state.lost_items = documents
          } else {
            state.found_items = documents
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
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
    },
    setAllLostItems ({commit}, items) {
      commit('setAllLostItems', items)
    },
    setAllFoundItems ({commit}, items) {
      commit('setAllFoundItems', items)
    },
    pushToCollection ({commit}, colAndDoc) {
      commit('pushToCollection', colAndDoc)
    },
    updateCollection ({commit}, collectionName) {
      commit('updateCollection', collectionName)
    },
    updateUserCollection ({commit}, collectionName) {
      commit('updateUserCollection', collectionName)
    }
  }
})
