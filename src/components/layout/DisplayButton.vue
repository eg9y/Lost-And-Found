<!-- The display button in the nav bar that opens a drop down menu -->

<template>
  <v-menu v-model="displayMenu" offset-y :close-on-content-click="false">
    <v-btn slot="activator" flat>
      <v-icon left>fas fa-list-ul</v-icon>
      Display
    </v-btn>
    <v-list>
      <v-list-tile @click="displayLost">
        <v-checkbox :label="`Lost Markers`" v-model="lost_checkbox"></v-checkbox>
      </v-list-tile>
      <v-list-tile @click="displayFound">
        <v-checkbox :label="`Found Markers`" v-model="found_checkbox"></v-checkbox>
      </v-list-tile>
      <v-list-tile>
        <v-btn block to="/database" @click="displayMenu=false">
          List View
        </v-btn>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data () {
    return {
      displayMenu: false,
      lost_checkbox: true,
      found_checkbox: true
    }
  },
  methods: {
    /*
      Displays the lost markers if the lost_checkbox is checked
    */
    displayLost () {
      if (this.lost_checkbox) {
        this.$store.commit('setLostToggleTrue')
      } else {
        this.$store.commit('setLostToggleFalse')
      }
    },
    /*
      Displays the found markers if the found_checkbox is checked
    */
    displayFound () {
      if (this.found_checkbox) {
        this.$store.commit('setFoundToggleTrue')
      } else {
        this.$store.commit('setFoundToggleFalse')
      }
    }
  }
}
</script>
