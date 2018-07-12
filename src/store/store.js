import Vue from 'vue'
import Vuex from 'vuex'

// setup firebase and db so all components can use
import firebase from 'firebase'
import db from '@/firebase/init'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null, //user object
        isUserLoggedIn: false,
        firebase,
        db
    },
    mutations: {
        setUser(state, user) {
            state.isUserLoggedIn = true;
            state.user = user; 
        },
        signOut(state) {
            state.isUserLoggedIn = false;
            state.user = null;
        }
    },
    actions: {
        setUser({commit}, user) {
            commit('setUser', user);
        },
        signOut({commit}) {
            commit('signOut');
        }
    }
})