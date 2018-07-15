<template>
<div>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon @click.stop ="drawer = !drawer">
    </v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>      
      <v-btn to="/">
        Home      
      </v-btn>
      <v-btn to="/database">
        Display
      </v-btn>
      <v-btn @click.stop="submission_dialog = true">
        Add Found Item
      </v-btn>
    </v-toolbar-items>   
    <v-toolbar-items v-if="!this.isUserLoggedIn">
      <v-btn @click="auth">
        Sign In    
      </v-btn>
    </v-toolbar-items> 
    <v-toolbar-items v-else>
      <v-btn @click="signOut">
        Sign Out  
      </v-btn>
      <v-btn @click="console.log('Profile page');">
        {{user.displayName}}
      </v-btn>
    </v-toolbar-items>    
  </v-toolbar>

  <!-- // POP UP SUBMISSION FORM -->
  <v-dialog v-model="submission_dialog" persistent max-width="500px" lazy>
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
            <small>* indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false" @click="addFound">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false">Close</v-btn>
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
            <v-btn color="blue darken-1" @click.native="submission_dialog = false" @click="addLost">Submit</v-btn>
            <v-btn color="blue darken-1" @click.native="submission_dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-dialog>

  <!-- SIDEBAR -->
  <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" >
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="console.log('palceholder')"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

</div>
</template>


<script>
  import db from '@/firebase/init'
  import firebase from 'firebase'
  import {mapState} from 'vuex'
  export default{
    name: 'AddFound',
    computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
    data(){
      return{
        type: null,
        description: null,
        contactEmail: null,
        location: null,
        timestamp: null,
        submission_dialog: false,
        drawer: null,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ]
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
      },
      auth() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
        'login_hint': 'cruzid@ucsc.edu'
        });
        firebase.auth().signInWithRedirect(provider);           
      },
      signOut() {
        firebase.auth().signOut().then(()=>{
          // Sign-out successful.
          this.$store.dispatch('signOut');
        }).catch(function(error) {
          // An error happened.
        });
      }
    }
  }
</script>

<style>

</style>
