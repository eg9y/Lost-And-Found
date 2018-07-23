<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <panel v-if="user" :title="user.displayName">
          <img class="img" justify-center :src="user.photoURL" alt="No pic">
          <h2>{{user.email}}</h2>
          <h2>{{user.phoneNumber}}</h2>
        </panel>
        <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6>
        <panel title="Lost Items">
          <template v-if="lost_items && lost_items.length > 0">
            <ul>
              <li v-if="lost_items.length > 0" v-for="(item, index) in lost_items" :key="index">
                {{item.description}}
                {{item.type}}
                {{item.timestamp}}
              </li>
            </ul>
          </template>
          <template v-else-if="!stillLoading">
            <h3>No submissions yet</h3>
          </template>
          <template v-else>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </template>
        </panel>
      </v-flex>
      <v-flex xs6>
        <panel title="Found Items">
          <template v-if="found_items && found_items.length > 0">
            <ul>
              <li v-if="found_items.length > 0" v-for="(item, index) in found_items" :key="index">
                {{item.description}}
                {{item.type}}
                {{item.timestamp}}
              </li>
            </ul>
          </template>
          <template v-else-if="!stillLoading">
            <h3>No submissions yet</h3>
          </template>
          <template v-else>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </template>
        </panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'stillLoading',
      'lost_items',
      'found_items',
      'user',
      'db'
    ])
  },
  data () {
    return {
    }
  },
  methods: {
    checkUserStatus () {
      if (this.stillLoading) {
        // Dont do anythin
      } else if (!this.user) {
        this.$router.push('/')
      }
    }
  },
  // immediate: true -> run fetchAllDocuments immediately.
  // watch -> if user changes, then run fetchAllDocument again
  watch: {
    user: {
      handler: 'checkUserStatus',
      immediate: true
    }
  }
}
</script>

<style>
.img {
  width: 20%;
  height: 20%;

}
</style>
