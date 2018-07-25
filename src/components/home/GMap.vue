<!-- This is the component that displays UCSC map using Google Maps API -->

<template>
  <div style="width: 100%; height: 100%">

    <!-- Alert that pops up when users attempt to create a marker without signing in -->
    <v-alert icon="new_releases" style="margin=0 0 0 0;" v-model="alert" dismissible type="error" transition="slide-y-transition">
      You must log in to pin!
    </v-alert>

    <!-- Pop up dialog that includes the submission form -->
    <submission-form :lat="lat" :lng="lng" :submissionDialog="submissionDialog" :user="user"></submission-form>

    <!-- The UCSC map -->
    <GmapMap :center="center" :zoom="16" :options="mapOptions" style="width: 100%; height: 100%" ref="mapRef" @dragend="checkBoundary" @click="addLocation">

      <!-- The marker info window -->
      <gmap-info-window v-cloak :options="infoOptions" :position="infoWindow.location" :opened="infoWinOpen" @closeclick="closeInfoWindow">
        <v-layout>
          <v-flex class="text-xs-center">
            <transition name="fade">
              <h1 style="text-align: center;">{{infoWindow.type}}</h1>
            </transition>
            <progressive-img v-if="infoWindow.pictures" :src="infoWindow.pictures" alt="" />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex v-if="infoWinOpen" transition="fade">
            <h3>{{infoWindow.description}}</h3>
            <h3>{{infoWindow.timestamp}}</h3>
            <h3>{{infoWindow.contactEmail | truncate}}</h3>
          </v-flex>
        </v-layout>
        <div class="text-xs-center">
          <v-btn v-if="isUserLoggedIn && user.uid == infoWindow.userID" @click="deleteMarker" color="error">Resolve</v-btn>
        </div>
      </gmap-info-window>

      <!-- The lost and found markers -->
      <GmapMarker v-if="lostToggle" :animation="2" v-for="(lost_item, index) in all_lost_items" :key="`lost-${index}-${lost_item.location._lat},${lost_item.location._long}`" :position="{lat: lost_item.location._lat, lng: lost_item.location._long}" :title="lost_item.type" :clickable="true" icon="../../../static/icons/lost_icon.png" @click="getMarkerDetails(lost_item, 'Lost: ', 'lost-items')" />
      <GmapMarker v-if="foundToggle" :animation="2" v-for="(found_item, index) in all_found_items" :key="`found-${index}-${found_item.location._lat},${found_item.location._long}`" :position="{lat: found_item.location._lat, lng: found_item.location._long}" :title="found_item.type" :clickable="true" icon="../../../static/icons/found_icon.png" @click="getMarkerDetails(found_item, 'Found: ', 'found-items')" />

      <!-- The pin that places the potential submission -->
      <GmapMarker v-if="lat && lng" :animation="2" :position="{lat, lng}" icon="http://s3.amazonaws.com/besport.com_images/status-pin.png" />
    </GmapMap>
  </div>
</template>

<script>
import SubmissionForm from './SubmissionForm/Index'
import firebase from 'firebase'
import { gmapApi } from 'vue2-google-maps'
import { EventBus } from '../../main'
import { mapState } from 'vuex'

export default {
  components: {
    'submission-form': SubmissionForm
  },
  name: 'gmap',
  data () {
    return {
      // lat and lng are used for location
      lat: null,
      lng: null,
      submissionDialog: false,
      center: { lat: 36.994635, lng: -122.058842 },
      infoWindow: {
        type: null,
        description: null,
        pictures: null,
        location: null,
        contactEmail: null,
        // timestamp: null,
        date: null,
        time: null,
        userID: null,
        id: null,
        collectionName: null
      },
      infoWinOpen: false,
      currentMid: null,
      // optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        },
        maxWidth: '200'
      },
      mapOptions: {
        minZoom: 15,
        maxZoom: 18,
        gestureHandling: 'cooperative',
        draggableCursor: 'url(http://s3.amazonaws.com/besport.com_images/status-pin.png), auto'
      },
      lost_items: [],
      found_items: [],
      alert: false
    }
  },
  computed: {
    google: gmapApi,
    ...mapState([
      'isUserLoggedIn',
      'user',
      'stillLoading',
      'db',
      'firebase',
      'all_lost_items',
      'all_found_items',
      'lostToggle',
      'foundToggle'
    ])
  },
  methods: {
    /*
      Checks the map boundaries, and prevents the user from going out of bounds
    */
    checkBoundary () {
      // these coordinates define the boundaries of the map/UCSC
      const MIN_LAT = 36.987615
      const MAX_LAT = 37.001976
      const MIN_LNG = -122.068846
      const MAX_LNG = -122.04808

      var strictBounds = new this.google.maps.LatLngBounds(
        new this.google.maps.LatLng(MIN_LAT, MIN_LNG),
        new this.google.maps.LatLng(MAX_LAT, MAX_LNG)
      )
      this.$refs.mapRef.$mapPromise.then(map => {
        if (strictBounds.contains(map.getCenter())) return

        // We're out of bounds - Move the map back within the bounds
        let c = map.getCenter()
        let x = c.lng()
        let y = c.lat()

        let maxX = strictBounds.getNorthEast().lng()
        let maxY = strictBounds.getNorthEast().lat()
        let minX = strictBounds.getSouthWest().lng()
        let minY = strictBounds.getSouthWest().lat()

        if (x < minX) x = minX
        if (x > maxX) x = maxX
        if (y < minY) y = minY
        if (y > maxY) y = maxY

        map.setCenter(new this.google.maps.LatLng(y, x))
      })
    },
    /*
      Closes the currently open info window,
      assigns values from selected marker to info window,
      opens the info window
    */
    getMarkerDetails (marker, collectionTitle, collectionName) {
      this.closeInfoWindow()
      if (marker.location) {
        // wait 1/4 seconds to set new info for info window
        this.infoWindow.pictures = marker.picture
        setTimeout(() => {
          this.infoWindow.location = { lat: marker.location._lat, lng: marker.location._long }
          this.infoWindow.type = collectionTitle + marker.type
          this.infoWindow.description = marker.description
          this.infoWindow.contactEmail = marker.contactEmail
          // this.infoWindow.timestamp = marker.timestamp
          this.infoWindow.date = marker.date
          this.infoWindow.time = marker.time
          this.infoWindow.userID = marker.userID
          this.infoWindow.collectionName = collectionName
          this.infoWindow.id = marker.id
          console.log('Info Window ID: ' + this.infoWindow.id)

          // check if its the same marker that was selected if yes toggle
          if (this.currentMid === marker.id) {
            this.infoWinOpen = !this.infoWinOpen
          } else {
            // if different marker set infowindow to open and reset current marker index
            this.infoWinOpen = true
            this.currentMid = marker.id
          }
          console.log(this.infoWinOpen)
          console.log(this.currentMid)
        }, 400)
      }
    },
    /*
      Updates the location for a new potential marker, and opens the submission form
      Parameters: e -- event object from clicking the map
    */
    addLocation (e) {
      if (this.infoWinOpen) {
        this.infoWinOpen = false
        return
      }
      this.lat = e.latLng.lat()
      this.lng = e.latLng.lng()
      if (!this.user) {
        this.alert = 'true'
        return
      }
      // open the submission form
      this.submissionDialog = true
    },
    /*
      Deletes the marker's associated entry in the db, and deletes the picture from Storage if applicable
    */
    deleteMarker () {
      // deletes associated picture if item has one, and it's stored in Storage
      if (this.infoWindow.pictures && this.infoWindow.pictures.includes(this.infoWindow.userID)) {
        var picRef = firebase.storage().refFromURL(this.infoWindow.pictures)
        picRef.delete().then(function () {
          console.log('Image successfully deleted from Storage')
          // eslint-disable-next-line
        }).catch(function (error) {
          console.log('Error in deleting image from Storage')
        })
      }

      // deletes the entry from the db and then updates the local copies
      this.db.collection(this.infoWindow.collectionName).doc(this.infoWindow.id).delete().then(() => {
        this.$store.dispatch('updateUserCollection', this.infoWindow.collectionName)
        this.$store.dispatch('updateCollection', this.infoWindow.collectionName)
        this.closeInfoWindow()
        console.log('Document successfully deleted!')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
    },
    /*
      Closes the info window and clears all the information fields
    */
    closeInfoWindow () {
      this.infoWinOpen = false
      this.infoWindow.type = null
      this.infoWindow.description = null
      this.infoWindow.pictures = null
      this.infoWindow.location = null
      this.infoWindow.contactEmail = null
      this.infoWindow.timestamp = null
      this.infoWindow.userID = null
      this.infoWindow.id = null
      this.infoWindow.collectionName = null
    },
    /*
      Given itemStr, searches for correct item in all_lost_items or all_found_items
      Parameters: itemStr -- string in the form of <x>-<item id>, where item id is the unique id from the database,
      and x is 'l' for items in the lost collection and 'f' for items in the found collection
    */
    findMarker (itemStr) {
      console.log('findMarker is running, looking for: ' + itemStr)
      if (this.all_lost_items && this.all_found_items) {
        var itemID = itemStr.substr(2)
        if (itemStr[0] === 'l') {
          for (var i = 0; i < this.all_lost_items.length; i++) {
            if (this.all_lost_items[i].id === itemID) {
              this.getMarkerDetails(this.all_lost_items[i], 'Lost: ', 'lost-items')
              i = this.all_lost_items.length
            }
          }
        } else if (itemStr[0] === 'f') {
          for (var j = 0; j < this.all_found_items.length; j++) {
            if (this.all_found_items[j].id === itemID) {
              this.getMarkerDetails(this.all_found_items[j], 'Found: ', 'found-items')
              j = this.all_Found_items.length
            }
          }
        }
      }
    }
  },
  watch: {
    all_lost_items () {
      if (this.$route.params.id) {
        this.findMarker(this.$route.params.id)
      }
    },
    all_found_items () {
      if (this.$route.params.id) {
        this.findMarker(this.$route.params.id)
      }
    }
  },
  created () {
    EventBus.$on('toggleSubmission', function (submission) {
      this.lat = null
      this.lng = null
      this.submissionDialog = false
    }.bind(this))
    EventBus.$on('newCenter', function (newCenter) {
      this.center = {
        lat: newCenter[0].location._lat,
        lng: newCenter[0].location._long
      }
      console.log(newCenter)
      this.getMarkerDetails(newCenter[0], newCenter[1], newCenter[2])
    }.bind(this))
    if (this.$route.params.id) {
      this.findMarker(this.$route.params.id)
    }
  },
  filters: {
    /*
      Define truncate filter to replace long words with ...
    */
    truncate (text) {
      let newText = text
      if (typeof (newText) === 'string' && newText.length > 14) {
        newText = newText.substring(0, 14)
        newText += '...'
      }
      return newText
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
