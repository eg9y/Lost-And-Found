<template>
  <div>
    <!-- NAV BAR -->
    <v-toolbar dark color="primary" v-if="!stillLoading">
      <v-toolbar-side-icon v-if="this.isUserLoggedIn" @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>

      <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn to="/" flat >
          <v-icon left>home</v-icon> Home
        </v-btn>
        <v-btn to="/database" flat>
          <v-icon left>fas fa-list-ul</v-icon>
          Display
        </v-btn>
        <!-- <v-btn @click.stop="lost_dialog = true" v-if="this.isUserLoggedIn" flat>
           Add Lost Item
        </v-btn>
        <v-btn @click.stop="found_dialog = true" v-if="this.isUserLoggedIn" flat>
          Add Found Item
        </v-btn> -->
      </v-toolbar-items>
      <v-toolbar-items v-if="!this.isUserLoggedIn">
        <v-btn @click="auth" flat>
          <v-icon left>fas fa-sign-in-alt</v-icon>
           Sign In
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-else>
        <v-btn @click="signOut" flat>
          <v-icon left>fas fa-sign-out-alt</v-icon>
          Sign Out
        </v-btn>
        <v-btn to="/profile" flat>
          {{user.displayName}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <template v-else>
      <v-progress-linear :indeterminate="true" color="info"></v-progress-linear>
    </template>

    <side-nav :mainDrawer="drawer"></side-nav>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import SideNav from './SideNav/Index'
import { EventBus } from '../../main'

export default {
  name: 'AddFound',
  components: {
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
      drawer: false
    }
  },
  created () {
    EventBus.$on('toggleDrawer', function () {
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
