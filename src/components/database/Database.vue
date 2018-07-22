<template>
  <div class="index container">

    <!--Sets the design and displays Lost Items-->
    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <v-layout justify-center="20px">
        <v-flex xs12 sm9 offset-sm>
          <v-card height="525px">
            <v-card-title primary-title>
              <div class="card-content">
                <div>
                  <img class="item-pictures" v-bind:id="lostItem.id" src="" alt="(NO PICTURE AVAILABLE)"><br/>
                </div>
                <h3 class="headline mb-0"><center><b>Lost:</b> {{lostItem.type}}</center></h3>
                <img class><br><b>Description:</b> {{ lostItem.description }}<br/> <b>Contact:</b> {{ lostItem.contactEmail }}<br/> <b>Time Stamp:</b> {{ lostItem.timestamp }}<br/> <b>Location:</b> {{ lostItem.location }}<br/><br/>
              </div>
            </v-card-title>
          <v-card-actions>
            <v-btn bottom flat color="orange">Contact</v-btn>
            <v-btn bottom flat color="orange">Location</v-btn>
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
                    <img class="item-pictures" v-bind:id="foundItem.id" src="" alt="(NO PICTURE AVAILABLE)"><br/>
                  </div>
                  <h3 class="headline mb-0"><center><b>Found:</b> {{foundItem.type}}</center></h3>
                  <img class><br><b>Description:</b> {{ foundItem.description }}<br/> <b>Contact:</b> {{ foundItem.contactEmail }}<br/> <b>Time Stamp:</b> {{ foundItem.timestamp }}<br/> <b>Location:</b> {{ foundItem.location }}<br/><br/>
                </div>
              </v-card-title>
            <v-card-actions>
              <v-btn bottom flat color="orange">Contact</v-btn>
              <v-btn bottom flat color="orange">Location</v-btn>
            </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </div><br/>

    <!--Lily's code
    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <div class="card-content">
        <h2 class="indigo-text">Lost: {{ lostItem.type }}</h2>
        <div>
          <img class="item-pictures" v-bind:id="lostItem.id" src="" alt="(NO PICTURE AVAILABLE)"><br/> Description: {{ lostItem.description }}<br/> Contact: {{ lostItem.contactEmail }}<br/> Time Stamp: {{ lostItem.timestamp }}<br/> Location: {{ lostItem.location }}<br/>
        </div>
      </div>
    </div><br/>

    <div class="card" v-for="foundItem in foundItems" :key="foundItem.id">
      <div class="card-content">
        <h2 class="indigo-text">Found: {{ foundItem.type }}</h2>
        <div>
          <img class="item-pictures" v-bind:id="foundItem.id" src="" alt="(NO PICTURE AVAILABLE)"><br/> Description: {{ foundItem.description }}<br/> Contact: {{ foundItem.contactEmail }}<br/> Time Stamp: {{ foundItem.timestamp }}<br/> Location: {{ foundItem.location }}<br/>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

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
    displayLost () {
      // fetch data from firestore
      db
        .collection('lost-items')
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let lostItem = doc.data()
            lostItem.id = doc.id
            this.lostItems.push(lostItem)

            // fetch picture from Storage (if not null)
            if (lostItem.picture) { this.getPicture(lostItem.picture, lostItem.id) }
          })
        })
    },
    /*
    */
    displayFound () {
      // fetch data from firestore
      db
        .collection('found-items')
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let foundItem = doc.data()
            foundItem.id = doc.id
            this.foundItems.push(foundItem)

            // fetch picture from Storage (if not null)
            if (foundItem.picture) { this.getPicture(foundItem.picture, foundItem.id) }
          })
        })
    },
    /*
      fetches the picture from Storage, url given by urlPic, and replaces the associated img tag src with the url
    */
    getPicture (urlPic, elemID) {
      storage.refFromURL(urlPic).getDownloadURL().then(function (url) {
        var img = document.getElementById(elemID)
        img.src = url
      })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  created () {
    this.displayLost()
    this.displayFound(console.log('displayFound ran'))
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
