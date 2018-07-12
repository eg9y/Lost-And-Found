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
      <v-btn @click.stop="lost_dialog = true">
        Add Lost Item
      </v-btn>
      <v-btn @click.stop="found_dialog = true">
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
      <v-btn to="/profile">
        {{user.displayName}}
      </v-btn>
    </v-toolbar-items>    
  </v-toolbar>

  <!-- // FOUND ITEM pop up submission form -->
  <v-layout row justify-center>
    <!-- Seperate Component -->
    <add-found 
        :user="user"
        :foundDialog="found_dialog"
    ></add-found>
  </v-layout>

  <!-- // LOST ITEM pop up submission form -->
  <v-layout row justify-center>
      <!-- Seperate Component -->
      <add-lost 
        :user="user"
        :lostDialog="lost_dialog"
      ></add-lost>
  </v-layout>

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
  import firebase from 'firebase'
  import {mapState} from 'vuex'

  import AddLost from './AddLost/Index'
  import AddFound from './AddFound/Index'

  import {EventBus} from '../../main';

  export default{
    name: 'AddFound',
    components: {
      "add-lost": AddLost,
      "add-found": AddFound
    },
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
      lost_dialog: false,
      found_dialog: false,
      drawer: null,
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ]
    }
  },
  created () {
    EventBus.$on('toggleDialog', function (lostOrFound) {
      if (lostOrFound === 'lost') {
        this.lost_dialog = false
      } else {
        this.found_dialog = false
      }
    }.bind(this));
  },
    methods:{
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
