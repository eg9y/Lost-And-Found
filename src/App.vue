<template>
  <v-app id="inspire">
    <nav-bar></nav-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import Navbar from '@/components/layout/Navbar'

export default {
  components: {
    'nav-bar': Navbar
  },
  data () {
    return {

    }
  },
  created () {
    this.$store.dispatch('stillLoading', true)
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        this.$store.dispatch('setUser', user)
        this.$store.dispatch('stillLoading', false)
      }
    }.bind(this))
  }
}
</script>
