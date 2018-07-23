<template>
    <v-menu v-model="displayMenu" offset-y :close-on-content-click="false">
        <v-btn slot="activator" flat>
            <v-icon left>fas fa-list-ul</v-icon>
            Display
        </v-btn>
        <v-list>
            <v-list-tile @click="displayLost">
                <v-checkbox :label="`Lost Markers`" v-model="checkbox1"></v-checkbox>
            </v-list-tile>
            <v-list-tile @click="displayFound">
                <v-checkbox :label="`Found Markers`" v-model="checkbox2"></v-checkbox>
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
      checkbox1: true,
      checkbox2: true
    }
  },
  methods: {
    displayLost () {
      if (this.checkbox1) {
        this.$store.commit('setLostToggleTrue')
      } else {
        this.$store.commit('setLostToggleFalse')
      }
    },
    displayFound () {
      if (this.checkbox2) {
        this.$store.commit('setFoundToggleTrue')
      } else {
        this.$store.commit('setFoundToggleFalse')
      }
    }
  }
}
</script>
