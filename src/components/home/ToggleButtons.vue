<template>
  <!-- <v-card flat class="py-5">
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-layout row wrap> -->
          <v-flex xs12 sm6 class="py-2">
            <v-btn-toggle v-model="toggle_multiple" multiple>
              <v-btn flat @click.stop="displayLost" value="Lost">
                Lost
              </v-btn>
              <v-btn flat value="Found">
                Found
              </v-btn>
            </v-btn-toggle>
          </v-flex>
        <!-- </v-layout>
      </v-container>
    </v-card-text>
  </v-card> -->
</template>

<script>
export default {
  data () {
    return {
      toggle_multiple: ['Lost', 'Found'],
      lostMarkers: true,
      foundMarkers: true
    }
  },
  methods: {
    displayLost () {
      if (this.lostMarkers) {
        console.log('true')
        this.lostMarkers = false
      } else {
        console.log('false')
        this.lostMarkers = true
      }
    }
  }
}
</script>
