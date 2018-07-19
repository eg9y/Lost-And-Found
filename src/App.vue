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
import { mapState } from 'vuex'

export default {
  components: {
    'nav-bar': Navbar
  },
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'db',
      'user'
    ])
  },
  created () {
    firebase.auth().onAuthStateChanged(
      function (user) {
        this.$store.dispatch('stillLoading', false)
        if (user) {
          // User is signed in.
          this.$store.dispatch('setUser', user)
          this.fetchAllUserDocuments()
        }
        this.fetchAllDocuments()
      }.bind(this)
    )
  },
  methods: {
    // Get all documents by user from lost-items and found-items collection
    // and put it to lost_items and found_items array
    fetchAllUserDocuments () {
      this.$store.dispatch('updateUserCollection', 'lost-items')
      this.$store.dispatch('updateUserCollection', 'found-items')
    },
    fetchAllDocuments () {
      this.$store.dispatch('updateCollection', 'lost-items')
      this.$store.dispatch('updateCollection', 'found-items')
    }
  }
}
</script>
