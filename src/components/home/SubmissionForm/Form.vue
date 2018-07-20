<template>
    <v-card>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-text-field class="text-field" v-model="type" label="Item *" :hint="typeHint" persistent-hint required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field v-model="description" label="Item Description" :hint="descriptionHint" persistent-hint required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field v-model="contactEmail" label="Contact Information" :hint="contactHint" persistent-hint required></v-text-field>
                    </v-flex>
                    <date-picker></date-picker>
                    <v-flex xs12>
                        <v-tabs
                          centered
                          v-model="active"
                          color="cyan"
                          dark
                          icons-and-text
                        >
                          <v-tabs-slider color="yellow"></v-tabs-slider>
                          <v-tab href="#tab-1">
                            Image URL
                            <v-icon>phone</v-icon>
                          </v-tab>

                          <v-tab href="#tab-2">
                            Image Upload
                            <v-icon>favorite</v-icon>
                          </v-tab>

                          <v-tab-item id="tab-1">
                            <v-card flat>
                              <v-card-text>
                                <input type="file" accept=".jpg, .png, .gif" @change="getPicInfo">
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item id="tab-2">
                            <v-card flat>
                              <v-card-text>
                                <v-text-field label="URL" v-model="imageURL"></v-text-field>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                        </v-tabs>
                    </v-flex>
                </v-layout>
            </v-container>
            <br />
            <small>* indicates required field</small>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="cyan" dark @click.native="toggleSubmission" @click="uploadImageAndDoc">Submit</v-btn>
            <v-btn color="cyan" dark @click.native="toggleSubmission">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import DatePicker from './DatePicker'
import { EventBus } from '../../../main'

export default {
  components: {
    'date-picker': DatePicker
  },
  props: [
    'db',
    'firebase',
    'user',
    'lat',
    'lng',
    'typeHint',
    'descriptionHint',
    'contactHint',
    'collectionName'],
  data () {
    return {
      type: null,
      description: null,
      contactEmail: null,
      timestamp: null,
      imageFile: null,
      imageURL: null,
      active: null
    }
  },
  methods: {
    uploadImageAndDoc () {
      this.imageFile && this.active === 'tab-1' ? this.uploadPic(this.collectionName) : this.addDoc(this.collectionName)
    },
    addDoc (collectionName) {
      if (this.type) {
        this.feedback = null
        this.db.collection(collectionName).add({
          type: this.type,
          description: this.description,
          contactEmail: this.contactEmail,
          location: new this.firebase.firestore.GeoPoint(this.lat, this.lng),
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
    /* upload picture to Storage and save the url to data.imageURL */
    /* NOTE!!! must be called before addDoc() if user is including a picture */
    uploadPic (collectionName) {
      var name = this.userID + '-' + (+new Date()) + '-' + this.type // give picture unique name based on userID, timestamp, and item type
      var metadata = { contentType: this.imageFile.type }
      const STORAGE = this.firebase.storage().ref()
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
    },
    toggleSubmission () {
      EventBus.$emit('toggleSubmission')
    }
  }
}
</script>

<style>
</style>