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
                  <div v-if="item.type">
                    <b>Item Type:</b> {{ item.type }}<br/>
                  </div>
                  <div v-else>
                    <b>Item Type:</b> N/A <br/>
                  </div>
                  <div v-if="item.description">
                    <b>Description:</b> {{ item.description }}<br/>
                  </div>
                  <div v-else>
                    <b>Description:</b> N/A<br/>
                  </div>
                  <div v-if="item.contactEmail">
                    <b>Contact:</b> {{ item.contactEmail }}<br/>
                  </div>
                  <div v-else>
                    <b>Contact:</b> N/A<br/>
                  </div>
                  <div v-if="item.date">
                    <b>Date:</b> {{ item.date }}<br/>
                  </div>
                  <div v-else>
                    <b>Date:</b> N/A<br/>
                  </div>
                  <div v-if="item.time">
                    <b>Time:</b> {{ item.time }}<br/>
                  </div>
                  <div v-else>
                    <b>Time:</b> N/A<br/>
                  </div>
                  <br/>
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
                  <div v-if="item.type">
                    <b>Item Type:</b> {{ item.type }}<br/>
                  </div>
                  <div v-else>
                    <b>Item Type:</b> N/A <br/>
                  </div>
                  <div v-if="item.description">
                    <b>Description:</b> {{ item.description }}<br/>
                  </div>
                  <div v-else>
                    <b>Description:</b> N/A<br/>
                  </div>
                  <div v-if="item.contactEmail">
                    <b>Contact:</b> {{ item.contactEmail }}<br/>
                  </div>
                  <div v-else>
                    <b>Contact:</b> N/A<br/>
                  </div>
                  <div v-if="item.date">
                    <b>Date:</b> {{ item.date }}<br/>
                  </div>
                  <div v-else>
                    <b>Date:</b> N/A<br/>
                  </div>
                  <div v-if="item.time">
                    <b>Time:</b> {{ item.time }}<br/>
                  </div>
                  <div v-else>
                    <b>Time:</b> N/A<br/>
                  </div>
                  <br/>
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
