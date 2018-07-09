<template>
<div>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>

    <v-spacer></v-spacer>

  <v-toolbar-items>
      <v-btn to="/auth">
        Sign in      
      </v-btn>
      <v-btn to="/">
        Home      
      </v-btn>
      <v-btn to="/database">
        Display
      </v-btn>
      <v-btn @click.stop="lost_dialog = true">
        Add Lost Item
      </v-btn>
      <v-btn @click.stop="found_dialog = true">
        Add Found Item
      </v-btn>
  </v-toolbar-items>
    
  </v-toolbar>

  <!-- // FOUND ITEM pop up submission form -->
  <v-layout row justify-center>
    <v-dialog v-model="found_dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Found Item</span>
        </v-card-title>
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
                  v-model="location"
                  label="Location Found"
                  hint="Where did you find the item?"
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
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="found_dialog = false" @click="addFound">Submit</v-btn>
          <v-btn color="blue darken-1" flat @click.native="found_dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

  <!-- // LOST ITEM pop up submission form -->
  <v-layout row justify-center>
    <v-dialog v-model="lost_dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Lost Item</span>
        </v-card-title>
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
                  v-model="location"
                  label="Location Found"
                  hint="Where did you lose the item?"
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
          <v-btn color="blue darken-1" flat @click.native="lost_dialog = false" @click="addLost">Submit</v-btn>
          <v-btn color="blue darken-1" flat @click.native="lost_dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

</div>
</template>

<script>
import db from '@/firebase/init'
  export default{
    name: 'AddFound',
    data(){
      return{
        type: null,
        description: null,
        contactEmail: null,
        location: null,
        timestamp: null,
        found_dialog: false,
        lost_dialog: false
      }
    },
    methods:{
      addFound(){
        if(this.type){
            this.feedback = null
            db.collection('found-items').add({
                type: this.type,
                description: this.description,
                contactEmail: this.contactEmail,
                location: this.location,
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
                  location: this.location,
                  timestamp: this.timestamp
              })
          }
          else{
              this.feedback = 'You must enter an item type'
          }
      }
    }
  }
</script>

<style>

</style>
