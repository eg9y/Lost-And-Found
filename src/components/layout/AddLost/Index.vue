<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Lost Item</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field v-model="type" label="Item *" hint="What did you lose?" persistent-hint required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="description" label="Item Description" hint="Please describe the item." persistent-hint required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="location" label="Location Found" hint="Where did you lose the item?" persistent-hint required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="timestamp" label="Date Found" hint="When did you lose the item?" persistent-hint required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="contactEmail" label="Contact Information" hint="(E-mail only for now)" persistent-hint required></v-text-field>
                            </v-flex>
                            <!-- upload picture...don't know how to make this pretty :( -->
                            <v-flex xs12>
                                <br/>Picture of Item:<br/>
                                <input type="file" accept=".jpg, .png, .gif" @change="getPicInfo">
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <br />
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- NOTE: submit button should call uploadPic function, not addToDB -->
                    <v-btn color="blue darken-1" flat @click.native="toggleDialog" @click="uploadPic">Submit</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="toggleDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import { EventBus } from '../../../main'

var storageRef = firebase.storage().ref();

export default {
    props: ['lostDialog', 'user'],
    data () {
        return {
            type: null,
            description: null,
            contactEmail: null,
            location: null,
            timestamp: null,
            imageFile: null,
            imageURL: null,
            dialog: false
        }
    },
    watch: {
        lostDialog () {
            this.dialog = this.lostDialog
        }
    },
    methods: {
        /*** adds new "lost-items" entry to DB based on form information ****/
        /*** NOTE: must be called after/within uploadPic()  ***/
        addToDB () {
            if (this.type) {
                this.feedback = null

                // create new entry in database
                db.collection('lost-items').add({
                    type: this.type,
                    description: this.description,
                    contactEmail: this.contactEmail,
                    location: this.location,
                    timestamp: this.timestamp,
                    picture: this.imageURL,
                    userID: this.user.uid
                })
            }
            else {
                this.feedback = 'You must enter an item type'
            }
        },
        toggleDialog () {
            this.dialog = !this.dialog
            EventBus.$emit('toggleDialog', 'lost');
        },

        /*** updates the picture info in data ***/
        getPicInfo (e) {
            this.imageFile = e.target.files[0];
        },

        /*** upload picture to Storage and save the url to data.image ***/
        /*** NOTE!!! must be called before addToDB() ***/
        uploadPic () {
            var self = this;
            var name = (+new Date()) + '-' + this.imageFile.name;
            var metadata = { contentType: this.imageFile.type };
            var uploadTask = storageRef.child(name).put(this.imageFile, metadata);
            uploadTask.on('state_changed', function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, function (error) {
                // Handle unsuccessful uploads
                console.log("Error: couldn't picture")
            }, function () {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    self.imageURL = downloadURL;
                    self.addToDB();     // add entry to database
                });
            });
        }
    }
}
</script>

<style>

</style>
