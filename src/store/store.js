import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null, //user object
        isUserLoggedIn: false
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