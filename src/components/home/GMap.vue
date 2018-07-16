<template>
    <GmapMap :center="{lat:36.994635, lng:-122.058842}" :zoom="16" :options="{minZoom: 15, maxZoom: 18, gestureHandling: 'cooperative'}" 
    style="width: 100%; height: 100%" ref="mapRef" @dragend="checkBoundary" @click="addMarker">
        <!-- <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
        /> -->
        
  <!-- // POP UP SUBMISSION FORM -->
  <v-dialog v-model="submission_dialog" persistent max-width="450px" lazy>
    <v-tabs
      centered
      color="cyan"
      dark
      icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#tab-1">
        Add Found Item
        <v-icon>phone</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Add Lost Item
        <v-icon>favorite</v-icon>
      </v-tab>

      <!-- // FOUND ITEM form -->
      <v-tab-item :id="'tab-1'">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="type"
                    label="Item *"
                    hint="What did you find?"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="description"
                    label="Item Description"
                    hint="Please describe the item."
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="timestamp"
                    label="Date Found"
                    hint="When did you find the item?"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="contactEmail"
                    label="Contact Information"
                    hint="(E-mail only for now)"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <br />
            <small>* indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false" @click="addFound">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false">Close</v-btn>
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
                  <v-text-field
                    v-model="type"
                    label="Item *"
                    hint="What did you lose?"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="description"
                    label="Item Description"
                    hint="Please describe the item."
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="timestamp"
                    label="Date Found"
                    hint="When did you lose the item?"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="contactEmail"
                    label="Contact Information"
                    hint="(E-mail only for now)"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <br />
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false" @click="addLost">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-dialog>
    </GmapMap>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import db from '@/firebase/init'
import firebase from 'firebase'
// these coordinates define the boundaries of the map/UCSC
var MIN_LAT = 36.987615,
    MAX_LAT = 37.001976,
    MIN_LNG = -122.068846,
    MAX_LNG = -122.048080;
export default {
    name: "GMap",
    data() {
        return {
            type: null,
            description: null,
            contactEmail: null,
            location: null,
            timestamp: null,
            submission_dialog: false,
            lat: null,
            lng: null
        }
    },
    methods: {
        addFound(){
            if(this.type){
                this.feedback = null
                db.collection('found-items').add({
                    type: this.type,
                    description: this.description,
                    contactEmail: this.contactEmail,
                    location: new firebase.firestore.GeoPoint(this.lat, this.lng),
                    timestamp: this.timestamp
                })
            }
            else{
                this.feedback = 'You must enter an item type'
            }
        },
        addLost(){
            if(this.type){
                this.feedback = null
                db.collection('lost-items').add({
                    type: this.type,
                    description: this.description,
                    contactEmail: this.contactEmail,
                    location: new firebase.firestore.GeoPoint(this.lat, this.lng),
                    timestamp: this.timestamp
                })
            }
            else{
                this.feedback = 'You must enter an item type'
            }
        },
        checkBoundary(){
            var strictBounds = new this.google.maps.LatLngBounds(
                new this.google.maps.LatLng(MIN_LAT, MIN_LNG),
                new this.google.maps.LatLng(MAX_LAT, MAX_LNG),
            );
            this.$refs.mapRef.$mapPromise.then((map) => {
                if (strictBounds.contains(map.getCenter())) return;
                // We're out of bounds - Move the map back within the bounds
                console.log('OMG! BOUNDS HAVE EXCEEDED!!1')
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
        /*** adds markers to map for entries in db under collectionName ***/
        displayMarkers(collectionName, collectionTitle){
            db.collection(collectionName).get().then(items => {
                items.docs.forEach(doc => {
                    let data = doc.data()
                    if (data.location){
                        var latitude =  parseFloat(data.location._lat)
                        var longitude = parseFloat(data.location._long)
                        // only place markers that are within scope of UCSC
                        if (longitude >= MIN_LNG && longitude <= MAX_LNG 
                            && latitude >= MIN_LAT && latitude <= MAX_LAT){
                            this.$refs.mapRef.$mapPromise.then((map) => {
                                let marker = new google.maps.Marker({
                                    position: {
                                        lat: latitude,
                                        lng: longitude
                                    },
                                    map,
                                    title: collectionTitle + doc.id     // title displayed as a hover tooltip
                                })
                                // add click event to marker
                                marker.addListener('click', () => {
                                    console.log(doc.id)
                                })
                            })
                        }   
                    }
                })
            })
        },
        /*** logs the coordinates of where user clicked on map ***/
        addMarker(e) {
            console.log(e.latLng.lat())
            console.log(e.latLng.lng())

            this.lat =  e.latLng.lat()
            this.lng = e.latLng.lng()
            // only place markers that are within scope of UCSC
            if (this.lng >= MIN_LNG && this.lng <= MAX_LNG 
                && this.lat >= MIN_LAT && this.lat <= MAX_LAT){
                this.$refs.mapRef.$mapPromise.then((map) => {
                    let marker = new google.maps.Marker({
                        position: {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng()
                        },
                        map
                    })

                    // open the submission form
                    this.submission_dialog = true

                    // add click event to marker
                    marker.addListener('click', () => {
                        // console.log(doc.id)
                    })
                })
            }
        }
    },
    computed: {
        google: gmapApi
    },
    created() {
        this.displayMarkers('lost-items', 'Lost: ')
        this.displayMarkers('found-items', 'Found: ')
        this.displayMarkers('centers', 'Center: ')
    },
    mounted () {
        this.displayMarkers('lost-items', 'Lost: ')
        this.displayMarkers('found-items', 'Found: ')
    }
}
</script>

<style>
/* .google-map {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    } */
</style>