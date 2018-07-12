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
                new this.google.maps.LatLng(36.987615, -122.068846),
                new this.google.maps.LatLng(37.001976, -122.048080),
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
        // adds markers to map for entries in db under collectionName
        // TODO: only add markers if not null and if within map boundaries
        displayMarkers(collectionName, collectionTitle){
            db.collection(collectionName).get().then(items => {
                items.docs.forEach(doc => {
                    let data = doc.data()
                    let latitude =  parseFloat(data.location._lat)
                    let longitude = parseFloat(data.location._long)
                    if(data.location){

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
                })
            })
        },
        // logs the coordinates of where user clicked on map
        logCoords(e){
            console.log(e.latLng.lng())
            console.log(e.latLng.lat())
        }
    },
    computed: {
            google: gmapApi
        },
    mounted() {
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
