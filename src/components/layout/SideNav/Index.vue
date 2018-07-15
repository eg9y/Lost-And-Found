<template>
  <v-navigation-drawer v-model="drawer" absolute temporary>
    <v-list class="pa-1">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img src="https://randomuser.me/api/portraits/men/85.jpg">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>John Leider</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile to="/Profile">
        <v-list-tile-action>
          <v-icon>dashboard</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>Profile</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile @click="signOut">
        <v-list-tile-action>
          <v-icon>power_settings_new</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>Sign Out</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>

     <v-divider inset></v-divider>
      <v-subheader inset>History</v-subheader>

<v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
        >
          <v-list-tile-action>
            <v-list-tile-title>{{ item.date }}</v-list-tile-title>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
        

  </v-navigation-drawer>
</template>

<script>
import { EventBus } from '../../../main'
import { mapState } from 'vuex'

export default {
  props: ['mainDrawer'],
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user',
      'lost_items',
      'found_items',
      'firebase'
    ])
  },
  data () {
    return {
      drawer: this.mainDrawer,
      items: [
          { title: 'Home', date: 'dashboard' },
          { title: 'About', date: 'question_answer' }
        ]
    }
  },
  methods: {
    toggleDrawer () {
      this.drawer = !this.drawer
      EventBus.$emit('toggleDrawer')
    },
    signOut () {
      this.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$store.dispatch('signOut')
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  watch: {
    mainDrawer () {
      this.drawer = this.mainDrawer
    },
    drawer () {
      console.log(this.drawer)
      if (!this.drawer) {
        this.toggleDrawer()
      }
    }
  }
}
</script>

<style>
</style>
