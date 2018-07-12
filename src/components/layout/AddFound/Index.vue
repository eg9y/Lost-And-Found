<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Found Item</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="type" label="Item *" hint="What did you find?" persistent-hint required clearable></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="description" label="Item Description" hint="Please describe the item." persistent-hint required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="location" label="Location Found" hint="Where did you find the item?" persistent-hint required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="timestamp" label="Date Found" hint="When did you find the item?" persistent-hint required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="contactEmail" label="Contact Information" hint="(E-mail only for now)" persistent-hint required></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <br />
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="toggleDialog" @click="addFound">Submit</v-btn>
        <v-btn color="blue darken-1" flat @click.native="toggleDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '../../../main'

export default {
  props: ['foundDialog', 'user'],
  computed: {
    ...mapState([
      'db'
    ])
  },
  data () {
    return {
      type: null,
      description: null,
      contactEmail: null,
      location: null,
      timestamp: null,
      dialog: false
    }
  },
  watch: {
    foundDialog () {
      this.dialog = this.foundDialog
    }
  },
  methods: {
    addFound () {
      if (this.type) {
        this.feedback = null
        this.db.collection('found-items').add({
          type: this.type,
          description: this.description,
          contactEmail: this.contactEmail,
          location: this.location,
          timestamp: this.timestamp,
          userID: this.user.uid
        })
      } else {
        this.feedback = 'You must enter an item type'
      }
    },
    toggleDialog () {
      this.dialog = !this.dialog
      EventBus.$emit('toggleDialog', 'found')
    }
  }
}
</script>

<style>
</style>
