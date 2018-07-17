<template>
  <!-- // POP UP SUBMISSION FORM -->
  <v-dialog v-model="submissionDialog" persistent max-width="450px" lazy>
    <v-tabs centered color="cyan" dark icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#tab-1">
        Add Found Item
        <v-icon>place</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Add Lost Item
        <v-icon>place</v-icon>
      </v-tab>

      <!-- // FOUND ITEM form -->
      <v-tab-item :id="'tab-1'">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="type" label="Item *" hint="What did you find?" persistent-hint required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="description" label="Item Description" hint="Please describe the item." persistent-hint required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-date-picker v-model="timestamp" :allowed-dates="allowedDates" class="mt-3"></v-date-picker>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="contactEmail" label="Contact Information" hint="(E-mail only for now)" persistent-hint required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <br/>Picture of Item:<br/>
                  <input type="file" accept=".jpg, .png, .gif" @change="getPicInfo">
                </v-flex>
              </v-layout>
            </v-container>
            <br />
            <small>* indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- NOTE: Submit button should call uploadPic function on click, not addDoc -->
            <v-btn color="blue darken-1" @click.native="toggleSubmission" @click="uploadPic('found-items')">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="toggleSubmission">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>

      <!-- // LOST ITEM form -->
      <v-tab-item :id="'tab-2'">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="type" label="Item *" hint="What did you lose?" persistent-hint required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="description" label="Item Description" hint="Please describe the item." persistent-hint required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-date-picker v-model="timestamp" :allowed-dates="allowedDates" class="mt-3"></v-date-picker>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="contactEmail" label="Contact Information" hint="(E-mail only for now)" persistent-hint required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <br/>Picture of Item:<br/>
                  <input type="file" accept=".jpg, .png, .gif" @change="getPicInfo">
                </v-flex>
              </v-layout>
            </v-container>
            <br />
            <small>* indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- NOTE: Submit button should call uploadPic function on click, not addDoc -->
            <v-btn color="blue darken-1" @click.native="toggleSubmission" @click="uploadPic('lost-items')">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="toggleSubmission">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-dialog>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import { EventBus } from '../../../main'

const STORAGE = firebase.storage().ref()

export default {
  props: ['lat', 'lng', 'submissionDialog', 'user'],
  data () {
    return {
      type: null,
      description: null,
      contactEmail: null,
      timestamp: null,
      date: null,
      currDate: new Date(),
      submission_dialog: false,
      imageFile: null,
      imageURL: null
    }
  },
  methods: {
    allowedDates (val) {
      const getDateMonthYear = val.split('-')
      const earlierOrCurrentDate = parseInt(getDateMonthYear[2], 10) <= this.currDate.getDate()
      const currentMonth = parseInt(getDateMonthYear[1], 10) === this.currDate.getMonth() + 1
      const earlierMonth = parseInt(getDateMonthYear[1], 10) < this.currDate.getMonth() + 1
      const sameYear = parseInt(getDateMonthYear[0], 10) <= this.currDate.getFullYear()
      return ((earlierOrCurrentDate && currentMonth) || earlierMonth) && sameYear
    },
    toggleSubmission () {
      EventBus.$emit('toggleSubmission')
    },
    addDoc (collectionName) {
      if (this.type) {
        this.feedback = null
        db.collection(collectionName).add({
          type: this.type,
          description: this.description,
          contactEmail: this.contactEmail,
          location: new firebase.firestore.GeoPoint(this.lat, this.lng),
          timestamp: this.timestamp,
          picture: this.imageURL,
          userID: this.user.uid
        }).then((docRef) => {
          console.log('doc :', docRef)
          docRef.get().then((doc) => {
            this.$store.dispatch('updateUserCollection', collectionName)
            this.$store.dispatch('updateCollection', collectionName)
          })
        })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        this.feedback = 'You must enter an item type'
      }
    },
    /* updates the picture info in data */
    getPicInfo (e) {
      this.imageFile = e.target.files[0]
    },

    /* upload picture to Storage and save the url to data.image */
    /* param "isLostItem" is true if item should be added to "lost-items" collection, and false if item should be added to "found-items" collection */
    /* NOTE!!! must be called before addDoc() */
    uploadPic (collectionName) {
      if (this.imageFile) {
        var name = this.userID + '-' + (+new Date()) + '-' + this.imageFile.name // give picture unique name based on userID, timestamp, and file name
        var metadata = { contentType: this.imageFile.type }
        var uploadTask = STORAGE.child(name).put(this.imageFile, metadata)
        var self = this
        uploadTask.on('state_changed', function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
        }, function (error) {
          // Handle unsuccessful uploads
          console.log("Error: couldn't upload picture,", error)
        }, function () {
          // Handle successful uploads on complete
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            self.imageURL = downloadURL
            self.addDoc(collectionName)
          })
        })
      } else { // no picture--go straight to updating db
        this.addDoc(collectionName)
      }
    }
  }
}
</script>

<style>

</style>
