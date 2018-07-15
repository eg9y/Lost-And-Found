<template>
  <div>
    <!-- NAV BAR -->
    <v-toolbar dark color="primary" v-if="!stillLoading">
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>

      <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn to="/">
          Home
        </v-btn>
        <v-btn to="/database">
          Display
        </v-btn>
        <v-btn @click.stop="lost_dialog = true" v-if="this.isUserLoggedIn">
          Add Lost Item
        </v-btn>
        <v-btn @click.stop="found_dialog = true" v-if="this.isUserLoggedIn">
          Add Found Item
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="!this.isUserLoggedIn">
        <v-btn @click="auth">
          Sign In
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn @click="signOut">
          Sign Out
        </v-btn>
        <v-btn to="/profile">
          {{user.displayName}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <template v-else>
      <v-progress-linear :indeterminate="true" color="info"></v-progress-linear>
    </template>

    <!-- // FOUND ITEM pop up submission form (seperate component) -->
    <v-layout row justify-center>
      <add-found :user="user" :foundDialog="found_dialog"></add-found>
    </v-layout>

    <!-- // LOST ITEM pop up submission form (seperate component) -->
    <v-layout row justify-center>
      <add-lost :user="user" :lostDialog="lost_dialog"></add-lost>
    </v-layout>

    <side-nav :mainDrawer="drawer"></side-nav>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import AddLost from './AddLost/Index'
import AddFound from './AddFound/Index'
import SideNav from './SideNav/Index'

import { EventBus } from '../../main'

export default {
  name: 'AddFound',
  components: {
    'add-lost': AddLost,
    'add-found': AddFound,
    'side-nav': SideNav
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user',
      'stillLoading',
      'firebase'
    ])
  },
  data () {
    return {
      lost_dialog: false,
      found_dialog: false,
      drawer: false
    }
  },
  created () {
    EventBus.$on('toggleDialog', function (lostOrFound) {
      if (lostOrFound === 'lost') {
        this.lost_dialog = false
      } else {
        this.found_dialog = false
      }
    }.bind(this))

    EventBus.$on('toggleDrawer', function () {
      console.log(this.type)
      console.log(this.drawer)
      this.drawer = false
    }.bind(this))
  },
  methods: {
    auth () {
      var provider = new this.firebase.auth.GoogleAuthProvider()
      this.firebase.auth().useDeviceLanguage()
      provider.setCustomParameters({
        'login_hint': 'cruzid@ucsc.edu'
      })
      this.firebase.auth().signInWithRedirect(provider)
    },
    signOut () {
      this.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$store.dispatch('signOut')
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style>
</style>
