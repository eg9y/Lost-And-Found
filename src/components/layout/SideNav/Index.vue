<!-- This is the Side Nav Component-->
<template>
  <v-navigation-drawer v-model="drawer" absolute temporary>

    <!-- This part of the drawer displays the User Info-->
    <v-list class="pa-1" v-if="user">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img :src="user.photoURL">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{user.displayName}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile to="/Profile">
        <v-list-tile-action>
          <v-icon>library_books</v-icon>
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

    <v-list>
      <v-divider></v-divider>
      <!-- This part of the drawer diplays the user's submission history, and center the map on the clicked entry -->
      <v-subheader inset>History</v-subheader>

      <v-list-tile v-for="lost_item in lost_items" :key="lost_item.id" @click="centerLost(lost_item,'Lost: ','lost-items' )">
        <v-list-tile-action>
          <v-icon>sentiment_very_dissatisfied</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ lost_item.type}}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-content>
          <v-list-tile-title>{{ lost_item.timestamp }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-for="found_item in found_items" :key="found_item.id" @click="centerFound(found_item,'Find: ','found-items' )">
        <v-list-tile-action>
          <v-icon>sentiment_very_satisfied</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ found_item.type }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-content>
          <v-list-tile-title>{{ found_item.timestamp }}</v-list-tile-title>
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
  data () {
    return {
      drawer: this.mainDrawer
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user',
      'lost_items',
      'found_items',
      'firebase'
    ])
  },
  methods: {
    /*
      Passes the information for a "lost" item to the GMap component
      Information is used to center the view on the marker and open the marker's info window
    */
    centerLost (lostItem, collectionTiltle, collectionName) {
      if (this.$router[this.$router.length - 1] !== '/') {
        this.$router.push(`/l-${lostItem.id}`)
      }
      EventBus.$emit('newCenter', [lostItem, collectionTiltle, collectionName])
    },

    /*
      Passes the information for a "found" item to the GMap component
      Information is used to center the view on the marker and open the marker's info window
    */
    centerFound (foundItem, collectionTiltle, collectionName) {
      if (this.$router[this.$router.length - 1] !== '/') {
        this.$router.push(`/f-${foundItem.id}`)
      }
      EventBus.$emit('newCenter', [foundItem, collectionTiltle, collectionName])
    },

    /*
      Passes the drawer status (open/closed) to the map component
    */
    toggleDrawer () {
      this.drawer = !this.drawer
      EventBus.$emit('toggleDrawer')
    },

    /*
      Signs the user out
    */
    signOut () {
      this.firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.$store.dispatch('signOut')
        this.drawer = !this.drawer
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
