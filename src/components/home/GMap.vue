<template>
  <div style="width: 100%; height: 100%">
    <v-alert icon="new_releases"
    style="margin=0 0 0 0;"
    v-model="alert" dismissible type="error" transition="slide-y-transition">
      Boi. You must log in to add stuff
    </v-alert>
    <GmapMap :center="center" :zoom="16" :options="{minZoom: 15, maxZoom: 18, gestureHandling: 'cooperative'}" style="width: 100%; height: 100%" ref="mapRef" @dragend="checkBoundary" @click="addLocation">
      <submission-form :lat="lat" :lng="lng" :submissionDialog="submissionDialog" :user="user"></submission-form>
      <gmap-info-window :options="infoOptions" :position="infoWindow.location" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
          <h1 style="text-align: center;">{{infoWindow.type}}</h1>
          <v-layout>
            <v-flex class="text-xs-center">
              <img :src="infoWindow.pictures" alt="">
            </v-flex>
          </v-layout>
          <h2>{{infoWindow.description}}</h2>
          <h2>{{infoWindow.timestamp}}</h2>
          <h2>{{infoWindow.contactEmail}}</h2>
        <div class="text-xs-center">
          <v-btn v-if="isUserLoggedIn && user.uid == infoWindow.userID" @click="deleteMarker" color="error">Delete</v-btn>
        </div>
      </gmap-info-window>
      <GmapMarker v-if="all_lost_items" :key="`lost-${index}`" v-for="(lost_item, index) in all_lost_items" :position="{lat: lost_item.location._lat, lng: lost_item.location._long}" :title="lost_item.type" :clickable="true" @click="getMarkerDetails(lost_item, index, 'Lost: ', 'lost-items')" />
      <GmapMarker v-if="all_found_items" :key="`found-${index}`" v-for="(found_item, index) in all_found_items" :position="{lat: found_item.location._lat, lng: found_item.location._long}" :title="found_item.type" :clickable="true" @click="getMarkerDetails(found_item, index, 'Found: ', 'found-items')" />
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

// strings used for displaying marker titles and info windows
// const LOST_STR = 'Lost: '
// const FOUND_STR = 'Found: '
// const CENTER_STR = 'Lost & Found Center'

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
    getMarkerDetails (marker, idx, collectionTitle, collectionName) {
      if (marker.location) {
        console.log('marker :', marker)
        this.infoWindow.location = { lat: marker.location._lat, lng: marker.location._long }
        this.infoWindow.type = collectionTitle + marker.type
        this.infoWindow.description = marker.description
        this.infoWindow.pictures = marker.picture
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
      }
    },
    addLocation (e) {
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
    }
    // addMarker () {
    // // only place markers that are within scope of UCSC
    // if (this.lng >= MIN_LNG && this.lng <= MAX_LNG &&
    //   this.lat >= MIN_LAT && this.lat <= MAX_LAT) {
    //   this.$refs.mapRef.$mapPromise.then((map) => {
    //     let marker = new this.google.maps.Marker({
    //       position: {
    //         lat: this.lat,
    //         lng: this.lng
    //       },
    //       map
    //     })

    //     // add click event to marker
    //     marker.addListener('click', () => {
    //       // console.log(doc.id)
    //     })
    //   })
    // }
    // },
    /* adds markers to map for entries in db under collectionName */
    // displayMarkers (collectionName, collectionTitle) {
    //   this.db
    //     .collection(collectionName)
    //     .get()
    //     .then(items => {
    //       items.docs.forEach(doc => {
    //         let data = doc.data()

    //         // if the doc have a location
    //         if (data.location) {
    //           var docID = doc.id
    //           var latitude = parseFloat(data.location._lat)
    //           var longitude = parseFloat(data.location._long)

    //           // only place markers that are within scope of UCSC
    //           const withinCampus = longitude >= MIN_LNG && longitude <= MAX_LNG && latitude >= MIN_LAT && latitude <= MAX_LAT
    //           if (withinCampus) {
    //             var self = this
    //             var markerTitle = (data.type) ? collectionTitle + data.type : collectionTitle

    //             this.$refs.mapRef.$mapPromise.then(map => {
    //               let marker = new this.google.maps.Marker({
    //                 position: {
    //                   lat: latitude,
    //                   lng: longitude
    //                 },
    //                 map,
    //                 title: markerTitle, // title displayed as a hover tooltip
    //                 markerID: docID,
    //                 infoWindow: new this.google.maps.InfoWindow({
    //                   content: ''
    //                 })
    //               })

    //               // open info window when marker is clicked
    //               marker.addListener('click', () => {
    //                 marker.addListener('click', function () {
    //                   marker.infoWindow.open(map, marker)
    //                 })
    //               })

    //               self.markers.push(marker)

    //               // set the contents of the infoWindow
    //               if (collectionTitle === CENTER_STR) { self.getInfoWindowContentCenters(data, collectionTitle, docID) } else { self.getInfoWindowContentItems(data, collectionTitle, docID) }
    //             })
    //           }
    //         }
    //       })
    //     })
    // },
    // /* set content of info window for lost-items and found-items markers  */
    // getInfoWindowContentItems (data, collectionTitle, markerID) {
    //   // find the marker we want to edit
    //   for (var i = 0; i < this.markers.length; ++i) {
    //     if (this.markers[i].markerID === markerID) {
    //       var marker = this.markers[i]
    //       i = this.markers.length
    //     }
    //   }
    //   // if db entry does have a picture, include it
    //   if (data.picture) {
    //     this.firebase.storage().refFromURL(data.picture).getDownloadURL().then(function (url) {
    //       var contentString = '<div class="window-content"><h2>' + collectionTitle + data.type +
    //         '</h2><div><img src="' + url + '" alt="[ITEM PICTURE]" width="150"><br/>Description: ' +
    //         data.description + '<br/> Contact: ' + data.contactEmail + '<br/> Time Stamp: ' +
    //         data.timestamp + '<br/></div></div>'
    //       marker.infoWindow.setContent(contentString)
    //     }).catch(function (error) {
    //       console.log(error)
    //     })
    //   } else { // if db entry doesn't have a picture
    //     var contentString = '<div class="window-content"><h2>' + collectionTitle + data.type +
    //       '</h2><div>Description: ' + data.description + '<br/> Contact: ' + data.contactEmail +
    //       '<br/> Time Stamp: ' + data.timestamp + '<br/></div></div>'
    //     marker.infoWindow.setContent(contentString)
    //   }
    // },

    // /* set content of info window for lost&found centers */
    // getInfoWindowContentCenters (data, collectionTitle, markerID) {
    //   // find the marker we want to edit
    //   for (var i = 0; i < this.markers.length; ++i) {
    //     if (this.markers[i].markerID === markerID) {
    //       var marker = this.markers[i]
    //       i = this.markers.length
    //     }
    //   }

    //   var contentString = '<div class="window-content"><h2>' + collectionTitle +
    //     '</h2><div>Description: ' + data.description + '</div></div>'
    //   marker.infoWindow.setContent(contentString)
    // }
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
    // this.displayMarkers('lost-items', LOST_STR)
    // this.displayMarkers('found-items', FOUND_STR)
    // this.displayMarkers('centers', CENTER_STR)
  }
}
</script>
<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
