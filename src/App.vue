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
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        this.fetchAllDocuments()
        this.$store.dispatch('setUser', user)
      }
    }.bind(this))
  },
  methods: {
    fetchDocuments (collectionName) {
      let documents = []
      if (this.user) {
        this.db.collection(collectionName).where('userID', '==', this.user.uid)
          .get()
          .then((items) => {
            console.log('this :', this)
            items.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, ' => ', doc.data())
              documents.push(doc.data())
              if (collectionName === "lost-items") {
                this.$store.dispatch('setLostItems', documents)
              } else {
                this.$store.dispatch('setFoundItems', documents)
              }
            })
          })
          .catch(function (error) {
            console.log('Error getting documents: ', error)
          })
      }
    },
    // Get all documents by user from lost-items and found-items collection
    // and put it to lost_items and found_items array
    fetchAllDocuments () {
      this.fetchDocuments('lost-items')
      this.fetchDocuments('found-items')
    }
  }
}
</script>
