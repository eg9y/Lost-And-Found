<template>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>

    <v-spacer></v-spacer>

  <v-toolbar-items>
      <v-btn @click="auth" v-if="!this.isUserLoggedIn">
        Sign in    
      </v-btn>
      <v-btn @click="signOut" v-else>
        Sign out
      </v-btn>
      <v-btn to="/">
        Home      
      </v-btn>
      <v-btn to="/database">
        Display
      </v-btn>
      <v-btn to="/add-lost-item">
        Add Lost Item
      </v-btn>
      <v-btn to="/add-found-item">
        Add Found Item
      </v-btn>
  </v-toolbar-items>
    
  </v-toolbar>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import {mapState} from 'vuex'

export default {
  methods: {
     auth() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
        'login_hint': 'cruzid@ucsc.edu'
        });
        firebase.auth().signInWithRedirect(provider);           
      },
      signOut() {
        firebase.auth().signOut().then(()=>{
          // Sign-out successful.
          this.$store.dispatch('signOut');
        }).catch(function(error) {
          // An error happened.
        });
      }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  }
}
</script>

<style>

</style>
