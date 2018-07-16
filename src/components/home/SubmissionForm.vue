<template>
    <!-- // POP UP SUBMISSION FORM -->
  <v-dialog v-model="submissionDialog" persistent max-width="450px" lazy>
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
            <v-btn color="blue darken-1" @click.native="submissionDialog = false" @click="addFound">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="submissionDialog = false">Close</v-btn>
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
            <v-btn color="blue darken-1" @click.native="toggleSubmission" @click="addLost">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="toggleSubmission">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-dialog>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import { EventBus } from '../../main'

export default {
  props: ['lat', 'lng', 'submissionDialog'],
  data () {
    return {
      type: null,
      description: null,
      contactEmail: null,
      timestamp: null,
      submission_dialog: false
    }
  },
  methods: {
    toggleSubmission () {
      EventBus.$emit('toggleSubmission')
    },
    addFound () {
      if (this.type) {
        this.feedback = null
        db.collection('found-items').add({
          type: this.type,
          description: this.description,
          contactEmail: this.contactEmail,
          location: new firebase.firestore.GeoPoint(this.lat, this.lng),
          timestamp: this.timestamp
        })
      } else {
        this.feedback = 'You must enter an item type'
      }
    },
    addLost () {
      if (this.type) {
        this.feedback = null
        db.collection('lost-items').add({
          type: this.type,
          description: this.description,
          contactEmail: this.contactEmail,
          location: new firebase.firestore.GeoPoint(this.lat, this.lng),
          timestamp: this.timestamp
        })
      } else {
        this.feedback = 'You must enter an item type'
      }
    }
  }
}
</script>

<style>

</style>
