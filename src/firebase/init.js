import firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}

const firebaseApp = firebase.initializeApp(config)
const firestore = firebaseApp.firestore()
const settings = {timestampsInSnapshots: true}
firestore.settings(settings)

export default firebaseApp.firestore()
