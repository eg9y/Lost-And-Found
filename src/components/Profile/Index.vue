<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <panel v-if="user" :title="user.displayName">
          <img class="img" justify-center :src="user.photoURL" alt="No pic">
          <h2>{{user.email}}</h2>
          <h2>{{user.phoneNumber}}</h2>
        </panel>
        <v-progress-circular
            indeterminate
            color="primary"
            v-else
        ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6>
        <panel title="Lost Items">
          <template v-if="lost_items.length">
            <ul>
              <li v-if="lost_items.length > 0" v-for="(item, index) in lost_items" :key="index">
                {{item}}
              </li>
            </ul>
          </template>
          <template v-else-if="!stillLoading">
            <h3>No submissions yet</h3>
          </template>
          <template v-else>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </template>
        </panel>
      </v-flex>
      <v-flex xs6>
        <panel title="Found Items">
          <template v-if="found_items.length">
            <ul>
              <li v-if="found_items.length > 0" v-for="(item, index) in found_items" :key="index">
                {{item}}
              </li>
            </ul>
          </template>
          <template v-else-if="!stillLoading">
            <h3>No submissions yet</h3>
          </template>
          <template v-else>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </template>
        </panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'stillLoading',
      'user',
      'db'
    ])
  },
  data () {
    return {
      lost_items: [],
      found_items: []
    }
  },
  methods: {
    // Gets all documents from collection (collectionName) by current user
    // and push those documents to documents array (argument)
    fetchDocuments (collectionName, documents) {
      if (this.user) {
        this.db.collection(collectionName).where('userID', '==', this.user.uid)
          .get()
          .then((items) => {
            items.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, ' => ', doc.data())
              documents.push(doc.data())
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
      this.fetchDocuments('lost-items', this.lost_items)
      this.fetchDocuments('found-items', this.found_items)
    },
    checkUserStatus () {
      if (this.stillLoading) {
        // Dont do anythin
      } else if (!this.user) {
        this.$router.push('/')
      } else {
        this.fetchAllDocuments()
      }
    }
  },
  // immediate: true -> run fetchAllDocuments immediately.
  // watch -> if user changes, then run fetchAllDocument again
  watch: {
    user: {
      handler: 'checkUserStatus',
      immediate: true
    }
  }
}
</script>

<style>
.img {
  width: 20%;
  height: 20%;
}
</style>
