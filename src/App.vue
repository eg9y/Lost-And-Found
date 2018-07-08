<template>
  <v-app id="inspire">
    <nav-bar></nav-bar>
    <v-content>
        <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  import db from '@/firebase/init'
  import firebase from 'firebase'
  import Navbar from "@/components/layout/Navbar"

  export default {
    components: {
      'nav-bar': Navbar
    },
    data() {
      return {

      }
    },
    created() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          this.$store.dispatch('setUser', user);
        } else {
          // No user is signed in.
        }
      }.bind(this));

    }
  }
</script>