<template>
  <div style="width: 100%; height: 100%">
    <v-alert icon="new_releases" style="margin=0 0 0 0;" v-model="alert" dismissible type="error" transition="slide-y-transition">
      You must log in to pin!
    </v-alert>
    <GmapMap id="map" :center="center" :zoom="16" :options="mapOptions" style="width: 100%; height: 100%" ref="mapRef" @dragend="checkBoundary" @click="addLocation">
      <submission-form :lat="lat" :lng="lng" :submissionDialog="submissionDialog" :user="user"></submission-form>
      <gmap-info-window
        v-cloak :options="infoOptions" :position="infoWindow.location" :opened="infoWinOpen" @closeclick="closeInfoWindow">
        <v-layout>
          <v-flex class="text-xs-center">
            <transition name="fade">
              <h1 style="text-align: center;">{{infoWindow.type}}</h1>
            </transition>
            <progressive-img v-if="infoWindow.pictures" :src="infoWindow.pictures" alt=""/>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex v-if="infoWinOpen" transition="fade">
              <h2>{{infoWindow.description}}</h2>
              <h2>{{infoWindow.timestamp}}</h2>
              <h2>{{infoWindow.contactEmail | truncate}}</h2>
          </v-flex>
        </v-layout>
        <div class="text-xs-center">
          <v-btn v-if="isUserLoggedIn && user.uid == infoWindow.userID" @click="deleteMarker" color="error">Resolve</v-btn>
        </div>
      </gmap-info-window>
      <GmapMarker
        v-if="all_lost_items"
        :animation="2"
        v-for="(lost_item, index) in all_lost_items"
        :key="`lost-${index}-${lost_item.location._lat},${lost_item.location._long}`"
        :position="{lat: lost_item.location._lat, lng: lost_item.location._long}"
        :title="lost_item.type"
        :clickable="true"
        icon="../../../static/icons/lost_icon.png"
        @click="getMarkerDetails(lost_item, index, 'Lost: ', 'lost-items')" />
      <GmapMarker
        v-if="all_found_items"
        :animation="2"
        v-for="(found_item, index) in all_found_items"
        :key="`found-${index}-${found_item.location._lat},${found_item.location._long}`"
        :position="{lat: found_item.location._lat, lng: found_item.location._long}"
        :title="found_item.type"
        :clickable="true"
        icon="../../../static/icons/found_icon.png"
        @click="getMarkerDetails(found_item, index, 'Found: ', 'found-items')" />
    </GmapMap>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import SubmissionForm from './SubmissionForm/Index'
import { EventBus } from '../../main'
import { mapState } from 'vuex'

// these coordinates define the boundaries of the map/UCSC
const MIN_LAT = 36.987615
const MAX_LAT = 37.001976
const MIN_LNG = -122.068846
const MAX_LNG = -122.04808

export default {
  components: {
    'submission-form': SubmissionForm
  },
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
        timestamp: null,
        userID: null,
        id: null,
        collectionName: null
      },
      infoWinOpen: false,
      currentMidx: null,
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
        draggableCursor: '../../../static/icons/lost_icon.png'
      },
      lost_items: [],
      found_items: [],
      alert: false
    }
  },
  methods: {
    checkBoundary () {
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
    // Assigns values from selected marker for info window to project
    getMarkerDetails (marker, idx, collectionTitle, collectionName) {
      this.closeInfoWindow()
      if (marker.location) {
        // wait 1/4 seconds to set new info for info window
        this.infoWindow.pictures = marker.picture
        setTimeout(() => {
          this.infoWindow.location = { lat: marker.location._lat, lng: marker.location._long }
          this.infoWindow.type = collectionTitle + marker.type
          this.infoWindow.description = marker.description
          this.infoWindow.contactEmail = marker.contactEmail
          this.infoWindow.timestamp = marker.timestamp
          this.infoWindow.userID = marker.userID
          this.infoWindow.collectionName = collectionName
          this.infoWindow.id = marker.id

          // check if its the same marker that was selected if yes toggle
          if (this.currentMidx === idx) {
            this.infoWinOpen = !this.infoWinOpen
          } else { // if different marker set infowindow to open and reset current marker index
            this.infoWinOpen = true
            this.currentMidx = idx
          }
        }, 400)
      }
    },
    // update new location for potential marker
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
    deleteMarker () {
      this.db.collection(this.infoWindow.collectionName).doc(this.infoWindow.id).delete().then(() => {
        this.$store.dispatch('updateUserCollection', this.infoWindow.collectionName)
        this.$store.dispatch('updateCollection', this.infoWindow.collectionName)
        this.infoWinOpen = false
        console.log('Document successfully deleted!')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
    },
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
      'all_found_items'
    ])
  },
  created () {
    EventBus.$on('toggleSubmission', function (submission) {
      this.submissionDialog = false
    }.bind(this))
  },
  filters: {
    // Define truncate filter to replace long words with ...
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
/* #map {
  cursor: url(../../../static/icons/lost_icon.png), auto;
} */
</style>
