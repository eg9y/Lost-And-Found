<template>
  <div class="index container">

    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <div class="card-content">
        <h2 class="indigo-text">Lost: {{ lostItem.type }}</h2>
        <div>
          <img class="item-pictures" v-bind:id="lostItem.id" src="" alt="[ITEM PICTURE]"><br/> Description: {{ lostItem.description }}<br/> Contact: {{ lostItem.contactEmail }}<br/> Time Stamp: {{ lostItem.timestamp }}<br/> Location: {{ lostItem.location }}<br/>
        </div>
      </div>
    </div><br/>

    <div class="card" v-for="foundItem in foundItems" :key="foundItem.id">
      <div class="card-content">
        <h2 class="indigo-text">Found: {{ foundItem.type }}</h2>
        <div>
          <img class="item-pictures" v-bind:id="foundItem.id" src="" alt="[ITEM PICTURE]"><br/> Description: {{ foundItem.description }}<br/> Contact: {{ foundItem.contactEmail }}<br/> Time Stamp: {{ foundItem.timestamp }}<br/> Location: {{ foundItem.location }}<br/>
        </div>
      </div>
    </div>

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
    /*** displays all of the "lost" items in the db ***/
    displayLost () {
      // fetch data from firestore
      db.collection('lost-items').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let lostItem = doc.data();
            lostItem.id = doc.id;
            this.lostItems.push(lostItem);

            // fetch picture from Storage (if not null)
            if (lostItem.picture)
              this.getPicture(lostItem.picture, lostItem.id);
          })
        })
    },
    /*** displays all of the "found" items in the db ***/
    displayFound () {
      // fetch data from firestore
      db.collection('found-items').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let foundItem = doc.data();
            foundItem.id = doc.id;
            this.foundItems.push(foundItem);

            // fetch picture from Storage (if not null)
            if (foundItem.picture)
              this.getPicture(foundItem.picture, foundItem.id);
          })
        })
    },
    /*** fetches the picture from Storage, url given by urlPic, 
     *   and replaces the associated img tag src with the url ***/
    getPicture (urlPic, elemID) {
      var gsReference = storage.refFromURL(urlPic).getDownloadURL().then(function (url) {
        var img = document.getElementById(elemID)
        img.src = url
      }).catch(function (error) {
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
