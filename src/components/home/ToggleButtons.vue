<template>
<!-- idea: wrap this in a v dialog that's always true, and then put this component inside gmapmap -->
  <!-- <v-card flat class="py-5">
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-layout row wrap> -->
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
        <!-- </v-layout>
      </v-container>
    </v-card-text>
  </v-card> -->
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
