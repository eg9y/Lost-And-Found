<!-- The entry point to our app -->

<template>
  <v-app id="app">
    <nav-bar></nav-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
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
      'firebase',
      'db',
      'user'
    ])
  },
  methods: {
    /*
      Gets all documents by user from lost-items and found-items collection
      and stores it in lost_items and found_items array
    */
    fetchAllUserDocuments () {
      this.$store.dispatch('updateUserCollection', 'lost-items')
      this.$store.dispatch('updateUserCollection', 'found-items')
    },
    /*
      Gets all documents from lost-items and found-items collection
      and stores it in lost_items and found_items array
    */
    fetchAllDocuments () {
      this.$store.dispatch('updateCollection', 'lost-items')
      this.$store.dispatch('updateCollection', 'found-items')
    }
  },
  created () {
    this.firebase.auth().onAuthStateChanged(
      (user) => {
        this.$store.dispatch('stillLoading', false)
        if (user) {
          // User is signed in.
          this.$store.dispatch('setUser', user)
          this.fetchAllUserDocuments()
        }
        this.fetchAllDocuments()
      }
    )

    this.db.collection('lost-items')
      .onSnapshot((querySnapshot) => {
        let lostItems = []
        querySnapshot.forEach(function (doc) {
          lostItems.push(doc.data())
        })
        this.$store.dispatch('setAllLostItems', lostItems)
        if (this.user) {
          this.$store.dispatch('updateUserCollection', 'lost-items')
        }
      })

    this.db.collection('found-items')
      .onSnapshot((querySnapshot) => {
        let foundItems = []
        querySnapshot.forEach(function (doc) {
          foundItems.push(doc.data())
        })
        this.$store.dispatch('setAllFoundItems', foundItems)
        if (this.user) {
          this.$store.dispatch('updateUserCollection', 'found-items')
        }
      })
  }
}
</script>
<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: rgb(247, 244, 244);
}
body {
  background-color: rgb(247, 244, 244);
}
</style>
