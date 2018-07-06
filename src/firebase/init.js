import firebase from 'firebase'
import firestore from 'firebase/firestore'

require('dotenv').config()

// Initialize Firebase
var config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MASSAGING_SENDER_ID
};
const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore()