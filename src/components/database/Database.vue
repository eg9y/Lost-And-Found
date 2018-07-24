<!-- This displays all the items in the database as a list view -->

<template>
  <div class="index container">

    <!--Sets the design and displays Lost Items-->
    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <v-layout justify-center="20px">
        <v-flex xs12 sm9 offset-sm>
          <v-card height="525px">
            <v-card-title primary-title>
              <div class="card-content">
                <h3 class="headline mb-0">
                  <center>
                    <b>Lost:</b> {{lostItem.type}}</center>
                </h3>
                <div v-if="lostItem.picture">
                  <br/><img class="item-pictures" :id="lostItem.id" :src="getExternalPic(lostItem.picture)" alt="(PICTURE UNAVAILABLE)">
                </div>
                <br/>
                <div v-if="lostItem.description">
                  <b>Description:</b> {{ lostItem.description }}<br/>
                </div>
                <div v-else>
                  <b>Description:</b> N/A<br/>
                </div>
                <div v-if="lostItem.contactEmail">
                  <b>Contact:</b> {{ lostItem.contactEmail }}<br/>
                </div>
                <div v-else>
                  <b>Contact:</b> N/A<br/>
                </div>
                <div v-if="lostItem.date">
                  <b>Date:</b> {{ lostItem.date }}<br/>
                </div>
                <div v-else>
                  <b>Date:</b> N/A<br/>
                </div>
                <div v-if="lostItem.time">
                  <b>Time:</b> {{ lostItem.time }}<br/>
                </div>
                <div v-else>
                  <b>Time:</b> N/A<br/>
                </div>
                <br/>
              </div>
            </v-card-title>
            <v-card-actions>
              <!-- <v-btn bottom flat color="cyan">Contact</v-btn> -->
              <v-btn bottom flat color="cyan" @click="locateItem(lostItem.id, 'l')">Location</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>

    <!--Sets the design and displays Found Items-->
    <div class="card" v-for="foundItem in foundItems" :key="foundItem.id">
      <v-layout justify-center="20px">
        <v-flex xs12 sm9 offset-sm>
          <v-card height="500px">
            <v-card-title primary-title>
              <div class="card-content">
                <h3 class="headline mb-0">
                  <center>
                    <b>Found:</b> {{foundItem.type}}</center>
                </h3>
                <div v-if="foundItem.picture">
                  <br/><img class="item-pictures" v-bind:id="foundItem.id" :src="getExternalPic(foundItem.picture)" alt="(PICTURE UNAVAILABLE)">
                </div><br/>
                <div v-if="foundItem.description">
                  <b>Description:</b> {{ foundItem.description }}<br/>
                </div>
                <div v-else>
                  <b>Description:</b> N/A<br/>
                </div>
                <div v-if="foundItem.contactEmail">
                  <b>Contact:</b> {{ foundItem.contactEmail }}<br/>
                </div>
                <div v-else>
                  <b>Contact:</b> N/A<br/>
                </div>
                <div v-if="foundItem.date">
                  <b>Date:</b> {{ foundItem.date }}<br/>
                </div>
                <div v-else>
                  <b>Date:</b> N/A<br/>
                </div>
                <div v-if="foundItem.time">
                  <b>Time:</b> {{ foundItem.time }}<br/>
                </div>
                <div v-else>
                  <b>Time:</b> N/A<br/>
                </div>
                <br/>
              </div>
            </v-card-title>
            <v-card-actions>
              <!-- <v-btn bottom flat color="cyan">Contact</v-btn> -->
              <v-btn bottom flat color="cyan" @click="locateItem(foundItem.id, 'f')">Location</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

// Creates a reference to firebase storage
const STORAGE = firebase.storage()

export default {
  name: 'Database',
  data () {
    return {
      lostItems: [],
      foundItems: []
    }
  },
  methods: {
    /*
      Displays all items in a collection in the database
    */
    displayCollection (collectionName, collectionArr) {
      // fetch data from firestore
      db
        .collection(collectionName)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let item = doc.data()
            item.id = doc.id
            collectionArr.push(item)

            // fetch picture from Storage (if not null)
            if (item.picture && item.picture.includes('firebasestorage')) {
              this.getPicture(item.picture, item.id)
            }
          })
        })
    },
    /*
      Fetches the picture from Storage and replaces the associated img tag src with the url
    */
    getPicture (urlPic, elemID) {
      STORAGE.refFromURL(urlPic).getDownloadURL().then(function (url) {
        let img = document.getElementById(elemID)
        img.src = url
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    /*
      Checks if the picture is stored in Firebase Storage
      If not, returns the same url
    */
    getExternalPic (urlPic) {
      if (urlPic && !urlPic.includes('firebasestorage')) {
        return urlPic
      }
    },
    /*
      Used in the Location button to redirect to the home page with the info window of the item open
    */
    locateItem (itemID, collectionType) {
      this.$router.push(`/${collectionType}-${itemID}`)
    }
  },
  created () {
    this.displayCollection('lost-items', this.lostItems)
    this.displayCollection('found-items', this.foundItems)
  }
}
</script>

<style>
.index {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 50px;
  margin-top: 60px;
}
.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.item-pictures {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  max-height: 200px;
}
</style>
