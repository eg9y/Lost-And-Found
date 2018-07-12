<template>
  <div class="index container">

    <div class="card" v-for="lostItem in lostItems" :key="lostItem.id">
      <div class="card-content">
        <h2 class="indigo-text">Lost: {{ lostItem.type }}</h2>
        <div>
          Description: {{ lostItem.description }}<br/> Contact: {{ lostItem.contactEmail }}<br/> Time Stamp: {{ lostItem.timestamp }}<br/> Location: {{ lostItem.location }}<br/>
          <!-- include script here to display picture -->
          Picture:<br/>
          <img id="lost-pic" src="" alt="no picture" height="200" width="200"><br/>
        </div>
      </div>
    </div><br/>

    <div class="cardFound" v-for="foundItem in foundItems" :key="foundItem.id">
      <div class="cardFound-content">
        <h2 class="indigo-text">Found: {{ foundItem.type }}</h2>
        <div>
          Description: {{ foundItem.description }}<br/> Contact: {{ foundItem.contactEmail }}<br/> Time Stamp: {{ foundItem.timestamp }}<br/> Location: {{ foundItem.location }}<br/> Picture:
          <br/>
          <img id="lost-pic" src="" alt="(NO PICTURE AVAILABLE)" height="200" width="200"><br/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import firebase from 'firebase'
import db from '@/firebase/init'

// var storage = firebase.storage()

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

            // get picture from Storage if it exists
            if (lostItem.picture) {
              this.getPicture(lostItem.picture, 'lost-pic')
            }
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

            // get picture from Storage if it exists
            if (foundItem.picture) {
              this.getPicture(foundItem.picture, 'found-pic')
            }
          })
        })
    },
    getPicture (urlPic, elemID) {
      // var gsReference = storage.refFromURL(urlPic).getDownloadURL().then(function (url) {
      //   var img = document.getElementById(elemID)
      //   img.src = url
      // }).catch(function (error) {
      //   console.log(error)
      // })
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
  grid-gap: 30px;
  margin-top: 60px;
}
.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.index .ingredients {
  margin: 30px auto;
}
.index .ingredients li {
  display: inline-block;
}
.index .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
</style>
