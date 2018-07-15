<template>
  <div class="index container">

    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <div class="card-content">
        <h2 class="indigo-text">Lost: {{ lostItem.type }}</h2>
        <div>
          <img class="item-pictures" id="lost-pic" src="" alt="(NO PICTURE AVAILABLE)"><br/> Description: {{ lostItem.description }}<br/> Contact: {{ lostItem.contactEmail }}<br/> Time Stamp: {{ lostItem.timestamp }}<br/> Location: {{ lostItem.location }}<br/>
        </div>
      </div>
    </div><br/>

    <div class="cardFound" v-for="foundItem in foundItems" :key="foundItem.id">
      <div class="cardFound-content">
        <h2 class="indigo-text">Found: {{ foundItem.type }}</h2>
        <div>
          <img class="item-pictures" id="lost-pic" src="" alt="(NO PICTURE AVAILABLE)"><br/> Description: {{ foundItem.description }}<br/> Contact: {{ foundItem.contactEmail }}<br/> Time Stamp: {{ foundItem.timestamp }}<br/> Location: {{ foundItem.location }}<br/>
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
    displayLost () {
      // fetch data from firestore
      db.collection('lost-items').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.data())
            let lostItem = doc.data()
            lostItem.id = doc.id
            this.lostItems.push(lostItem)
            if (lostItem.picture) // get picture from Storage if it exists
              this.getPicture(lostItem.picture, 'lost-pic')
          })
        })
    },
    displayFound () {
      db.collection('found-items').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            console.log(doc.data())
            let foundItem = doc.data()
            foundItem.id = doc.id
            this.foundItems.push(foundItem)
            if (foundItem.picture) // get picture from Storage if it exists
              this.getPicture(foundItem.picture, 'found-pic')
          })
        })
    },
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