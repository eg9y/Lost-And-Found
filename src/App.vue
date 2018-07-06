<template>
  <v-app id="inspire">
    <nav-bar></nav-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>

          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navbar from "@/components/layout/Navbar"

  export default {
    components: {
      'nav-bar': Navbar
    },
    data() {
      return {

      }
    }
  }
</script>