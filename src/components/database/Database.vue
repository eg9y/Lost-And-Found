<template>
  <div class="index container">

    <!--Sets the design and displays Lost Items-->
    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <v-layout justify-center="20px">
        <v-flex xs12 sm9 offset-sm>
          <v-card height="525px">
            <v-card-title primary-title>
            <div class="card-content">
            <div v-if="lostItem.picture">
               <img class="item-pictures" :id="lostItem.id" :src="getExternalPic(lostItem.picture)" alt="(PICTURE UNAVAILABLE)"><br/>
            </div>
            <h3 class="headline mb-0"><center><b>Lost:</b> {{lostItem.type}}</center></h3>
            <img class><br><b>Description:</b> {{ lostItem.description }}<br/> <b>Contact:</b> {{ lostItem.contactEmail }}<br/> <b>Date:</b> {{ lostItem.date }}<br/> <b>Time:</b> {{ lostItem.time }} <br/><br/>
          </div>
          </v-card-title>
          <v-card-actions>
            <!-- <v-btn bottom flat color="cyan">Contact</v-btn> -->
            <v-btn bottom flat color="cyan" @click="locateItem(lostItem.id, 'l')">Location</v-btn>
          </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div><br/>

      <!--Displays Found Items-->
      <div class="card" v-for="foundItem in foundItems" :key="foundItem.id">
        <v-layout justify-center="20px">
          <v-flex xs12 sm9 offset-sm>
            <v-card height ="500px">
              <v-card-title primary-title>
                <div class="card-content">
                  <div>
                    <img class="item-pictures" v-bind:id="foundItem.id" :src="getExternalPic(foundItem.picture)" alt="(PICTURE UNAVAILABLE)"><br/>
                  </div>
                  <h3 class="headline mb-0"><center><b>Found:</b> {{foundItem.type}}</center></h3>
                  <img class><br><b>Description:</b> {{ foundItem.description }}<br/> <b>Contact:</b> {{ foundItem.contactEmail }}<br/> <b>Date:</b> {{ foundItem.date }}<br/> <b>Time:</b> {{ foundItem.time }}<br/><br/><br/>
                </div>
              </v-card-title>
            <v-card-actions>
              <!-- <v-btn bottom flat color="cyan">Contact</v-btn> -->
              <v-btn bottom flat color="cyan" @click="locateItem(foundItem.id, 'f')">Location</v-btn>
            </v-card-actions>
            </v-card>
          </v-flex>
          </v-layout>
        </div><br/>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
// import { EventBus } from '../../main'

var storage = firebase.storage()

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
      fetches the picture from Storage, url given by urlPic, and replaces the associated img tag src with the url
    */
    getPicture (urlPic, elemID) {
      storage.refFromURL(urlPic).getDownloadURL().then(function (url) {
        let img = document.getElementById(elemID)
        img.src = url
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    getExternalPic (urlPic) {
      if (urlPic && !urlPic.includes('firebasestorage')) {
        return urlPic
      }
    },
    locateItem (itemID, collectionType) {
      console.log('Item ID: ' + itemID)
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
