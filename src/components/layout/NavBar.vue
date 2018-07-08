<template>
  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Lost And Found</v-toolbar-title>

    <v-spacer></v-spacer>

  <v-toolbar-items>
      <v-btn to="/auth">
        Sign in      
      </v-btn>
      <v-btn to="/">
        Home      
      </v-btn>
      <v-btn to="/database">
        Display
      </v-btn>
  </v-toolbar-items>
    
  </v-toolbar>
</template>

<script>
export default {

}
</script>

<style>

</style>
