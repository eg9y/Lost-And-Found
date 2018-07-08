<template>
  <v-app id="inspire">
    <nav-bar></nav-bar>
    <v-content>
        <router-view/>
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