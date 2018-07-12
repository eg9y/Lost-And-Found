<template>
    <v-layout>
        <v-flex class="mb-2 mt-4">
            <div class="white elevation-2">
                <v-toolbar flat dense color="primary" dark>
                    <v-toolbar-title>{{user.displayName}}</v-toolbar-title>
                </v-toolbar>
                <div class="pl-4 pr-4 pt-2 pb-2">
                    <h2>
                        photoURL: {{user.photoURL}}
                    </h2>
                    <h2>
                        Email: {{user.email}}
                    </h2>
                    <h2>
                        Phone number: {{user.phoneNumber}}
                    </h2>
                </div>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  data() {
      return {

      }
  },
  methods: {

  }
}
</script>

<style>
</style>