<template>
    <GmapMap
        :center="{lat:36.994635, lng:-122.058842}"
        :zoom="16"
        :options="{minZoom: 15, maxZoom: 18, gestureHandling: 'cooperative'}"
        style="width: 100%; height: 100%"
        ref="mapRef"
        @dragend="checkBoundary"
        @click="logCoords"
    >
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
import {gmapApi} from 'vue2-google-maps'
import db from '@/firebase/init'

// these coordinates define the boundaries of the map/UCSC
var MIN_LAT = 36.987615,
    MAX_LAT = 37.001976,
    MIN_LNG = -122.068846,
    MAX_LNG = -122.048080;

export default {
    name: "GMap",
    data() {
        return {
            lat: 53,
            lng: -2
        }
    },
    methods: {
        checkBoundary(){
            var strictBounds = new this.google.maps.LatLngBounds(
                new this.google.maps.LatLng(MIN_LAT, MIN_LNG),
                new this.google.maps.LatLng(MAX_LAT, MAX_LNG),
            );
            this.$refs.mapRef.$mapPromise.then((map) => {
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
        logCoords(e){
            console.log(e.latLng.lng())
            console.log(e.latLng.lat())
        }
    },
    computed: {
            google: gmapApi
        },
    created() {
        this.displayMarkers('lost-items', 'Lost: ')
        this.displayMarkers('found-items', 'Found: ')
        this.displayMarkers('centers', 'Center: ')
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
