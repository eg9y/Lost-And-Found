<template>
  <v-dialog v-model="toggleButtons" persistent max-width="112px" lazy>
    <v-btn-toggle v-model="toggle_multiple" multiple>
      <v-btn @click="displayLost" value="Lost">
        Lost
      </v-btn>
      <v-btn @click="displayFound" value="Found">
        Found
      </v-btn>
    </v-btn-toggle>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      toggleButtons: true,
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
