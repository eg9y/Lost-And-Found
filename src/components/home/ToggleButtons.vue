<template>
  <!-- <v-toolbar dense floating> -->
    <v-flex xs12 sm6 class="py-2">
      <v-btn-toggle v-model="toggle_multiple" multiple>
        <v-btn @click="displayLost" value="Lost">
          Lost
        </v-btn>
        <v-btn @click="displayFound" value="Found">
          Found
        </v-btn>
      </v-btn-toggle>
    </v-flex>
  <!-- </v-toolbar> -->

   <!-- wrapped in v-dialog makes it appear over the map, but makes the map faded -->
  <!-- <v-dialog v-model="toggleButtons" persistent max-width="112px" lazy>
    <v-btn-toggle v-model="toggle_multiple" multiple>
      <v-btn @click="displayLost" value="Lost">
        Lost
      </v-btn>
      <v-btn @click="displayFound" value="Found">
        Found
      </v-btn>
    </v-btn-toggle>
  </v-dialog> -->
</template>

<script>
export default {
  data () {
    return {
      toggle_multiple: ['Lost', 'Found']
    }
  },
  methods: {
    displayLost () {
      this.$store.commit('setLostToggle')
    },
    displayFound () {
      this.$store.commit('setFoundToggle')
    }
  }
}
</script>
