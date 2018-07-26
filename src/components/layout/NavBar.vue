<!-- The navigation bar at the top of the web app -->

<template>
  <div>

    <v-toolbar dark color="primary" v-if="!stillLoading">
      <template v-if="$vuetify.breakpoint.width < 710">
        <v-menu :nudge-width="100">
                <v-toolbar-title slot="activator">
                    <v-toolbar-side-icon></v-toolbar-side-icon>
                </v-toolbar-title>
                <v-list>
                    <v-list-tile v-if="!this.isUserLoggedIn" @click="auth">
                        <v-list-tile-title >
                            <v-icon left>fas fa-sign-in-alt</v-icon> Sign In
                        </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-else @click="signOut">
                      <v-list-tile-title>
                            <v-icon left>fas fa-sign-out-alt</v-icon> Sign Out
                        </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-title>

                        </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-if="this.isUserLoggedIn" to="/profile">
                        <v-list-tile-title>
                            {{user.displayName}}
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat dark router to="/" class="">
                  <v-icon left>home</v-icon> Home
                </v-btn>
                <display-button></display-button>
            </v-toolbar-items>
      </template>
      <template v-if="$vuetify.breakpoint.width >= 710">
        <v-toolbar-side-icon v-if="this.isUserLoggedIn" @click.stop="drawer = !drawer">
        </v-toolbar-side-icon>
        <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Home button -->
        <v-toolbar-items>
          <v-btn to="/" flat>
            <v-icon left>home</v-icon> Home
          </v-btn>
          <display-button></display-button>
        </v-toolbar-items>

        <!-- Sign in/out buttons -->
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
      </template>
    </v-toolbar>

    <!-- Loading bar -->
    <template v-else>
      <v-progress-linear :indeterminate="true" color="info"></v-progress-linear>
    </template>

    <!-- Side nav drawer -->
    <side-nav :mainDrawer="drawer"></side-nav>

  </div>
</template>

<script>
import SideNav from './SideNav/Index'
import DisplayButton from './DisplayButton'
import { mapState } from 'vuex'
import { EventBus } from '../../main'

export default {
  components: {
    'side-nav': SideNav,
    'display-button': DisplayButton
  },
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user',
      'stillLoading',
      'firebase'
    ])
  },
  methods: {
    /*
      Redirects to Google authentication
    */
    auth () {
      var provider = new this.firebase.auth.GoogleAuthProvider()
      this.firebase.auth().useDeviceLanguage()
      provider.setCustomParameters({
        'login_hint': 'cruzid@ucsc.edu'
      })
      this.firebase.auth().signInWithRedirect(provider)
    },
    /*
      Signs the user out
    */
    signOut () {
      this.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$store.dispatch('signOut')
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  created () {
    EventBus.$on('toggleDrawer', function () {
      this.drawer = false
    }.bind(this))
  }
}
</script>
