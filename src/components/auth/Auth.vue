<template>
    <v-btn @click="auth">
        Sign in!
    </v-btn>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'


export default {
    methods: {
        auth() {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().useDeviceLanguage();
            provider.setCustomParameters({
            'login_hint': 'cruzid@ucsc.edu'
            });
            firebase.auth().signInWithRedirect(provider);           
        }
    }

}
</script>

<style>

</style>
