<template>
    <GmapMap :center="{lat:36.994635, lng:-122.058842}" :zoom="16" :options="{minZoom: 15, maxZoom: 18, gestureHandling: 'cooperative'}" style="width: 100%; height: 100%" ref="mapRef" @dragend="checkBoundary" @click="logCoords">
        <!-- <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
        /> -->
    </GmapMap>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import firebase from 'firebase';
import db from "@/firebase/init";

const STORAGE = firebase.storage();

// these coordinates define the boundaries of the map/UCSC
const MIN_LAT = 36.987615,
    MAX_LAT = 37.001976,
    MIN_LNG = -122.068846,
    MAX_LNG = -122.04808;

// strings used for displaying marker titles and info windows
const LOST_STR = "Lost: ",
    FOUND_STR = "Found: ",
    CENTER_STR = "Lost & Found Center";

export default {
    name: "GMap",
    data () {
        return {
            lat: 53,
            lng: -2,
            markers: []
        };
    },
    methods: {
        checkBoundary () {
            var strictBounds = new this.google.maps.LatLngBounds(
                new this.google.maps.LatLng(MIN_LAT, MIN_LNG),
                new this.google.maps.LatLng(MAX_LAT, MAX_LNG)
            );
            this.$refs.mapRef.$mapPromise.then(map => {
                if (strictBounds.contains(map.getCenter())) return;

                // We're out of bounds - Move the map back within the bounds
                console.log("OMG! BOUNDS HAVE EXCEEDED!!1");
                let c = map.getCenter(),
                    x = c.lng(),
                    y = c.lat(),
                    maxX = strictBounds.getNorthEast().lng(),
                    maxY = strictBounds.getNorthEast().lat(),
                    minX = strictBounds.getSouthWest().lng(),
                    minY = strictBounds.getSouthWest().lat();

                if (x < minX) x = minX;
                if (x > maxX) x = maxX;
                if (y < minY) y = minY;
                if (y > maxY) y = maxY;

                map.setCenter(new this.google.maps.LatLng(y, x));
            });
        },

        /*** adds markers to map for entries in db under collectionName ***/
        displayMarkers (collectionName, collectionTitle) {
            db
                .collection(collectionName)
                .get()
                .then(items => {
                    items.docs.forEach(doc => {
                        let data = doc.data();
                        if (data.location) {
                            var docID = doc.id;
                            var latitude = parseFloat(data.location._lat);
                            var longitude = parseFloat(data.location._long);

                            // only place markers that are within scope of UCSC
                            if (
                                longitude >= MIN_LNG &&
                                longitude <= MAX_LNG &&
                                latitude >= MIN_LAT &&
                                latitude <= MAX_LAT
                            ) {
                                var self = this;
                                var markerTitle = (data.type) ? collectionTitle + data.type : collectionTitle;

                                this.$refs.mapRef.$mapPromise.then(map => {
                                    let marker = new google.maps.Marker({
                                        position: {
                                            lat: latitude,
                                            lng: longitude
                                        },
                                        map,
                                        title: markerTitle, // title displayed as a hover tooltip
                                        markerID: docID,
                                        infoWindow: new google.maps.InfoWindow({
                                            content: ""
                                        })
                                    });

                                    // open info window when marker is clicked
                                    marker.addListener("click", () => {
                                        marker.addListener('click', function () {
                                            marker.infoWindow.open(map, marker);
                                        });
                                    });

                                    self.markers.push(marker);

                                    // set the contents of the infoWindow
                                    if (collectionTitle == CENTER_STR)
                                        self.getInfoWindowContentCenters(data, collectionTitle, docID);
                                    else
                                        self.getInfoWindowContentItems(data, collectionTitle, docID);
                                });
                            }
                        }
                    });
                });
        },

        /*** logs the coordinates of where user clicked on map ***/
        logCoords (e) {
            console.log(e.latLng.lng());
            console.log(e.latLng.lat());
        },

        /*** set content of info window for lost-items and found-items markers  ***/
        getInfoWindowContentItems (data, collectionTitle, markerID) {
            // find the marker we want to edit
            for (var i = 0; i < this.markers.length; ++i) {
                if (this.markers[i].markerID == markerID) {
                    var marker = this.markers[i];
                    i = this.markers.length;
                }
            }
            // if db entry does have a picture, include it
            if (data.picture) {
                var self = this;
                var gsReference = STORAGE.refFromURL(data.picture).getDownloadURL().then(function (url) {
                    var contentString = '<div class="window-content"><h2>' + collectionTitle + data.type +
                        '</h2><div><img src="' + url + '" alt="[ITEM PICTURE]" width="150"><br/>Description: ' +
                        data.description + '<br/> Contact: ' + data.contactEmail + '<br/> Time Stamp: ' +
                        data.timestamp + '<br/></div></div>';
                    marker.infoWindow.setContent(contentString);
                }).catch(function (error) {
                    console.log(error)
                })
            }
            else {  // if db entry doesn't have a picture
                var contentString = '<div class="window-content"><h2>' + collectionTitle + data.type +
                    '</h2><div>Description: ' + data.description + '<br/> Contact: ' + data.contactEmail +
                    '<br/> Time Stamp: ' + data.timestamp + '<br/></div></div>';
                marker.infoWindow.setContent(contentString);
            }
        },

        /*** set content of info window for lost&found centers ***/
        getInfoWindowContentCenters (data, collectionTitle, markerID) {
            // find the marker we want to edit
            for (var i = 0; i < this.markers.length; ++i) {
                if (this.markers[i].markerID == markerID) {
                    var marker = this.markers[i];
                    i = this.markers.length;
                }
            }

            var contentString = '<div class="window-content"><h2>' + collectionTitle + 
                '</h2><div>Description: ' + data.description + '</div></div>';
            marker.infoWindow.setContent(contentString);
        }
    },
    computed: {
        google: gmapApi
    },
    created () {
        this.displayMarkers("lost-items", LOST_STR);
        this.displayMarkers("found-items", FOUND_STR);
        this.displayMarkers("centers", CENTER_STR);
    }
};
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
