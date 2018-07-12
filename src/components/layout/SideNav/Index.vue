<template>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
    <v-list class="pa-1">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img src="https://randomuser.me/api/portraits/men/85.jpg" >
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>John Leider</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile
        v-for="item in items"
        :key="item.title"
        @click="console.log('palceholder')"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {EventBus} from '../../../main'

export default {
    props: ['mainDrawer'],
    data() {
        return {
            drawer: this.mainDrawer,
            items: [
                { title: 'Home', icon: 'dashboard' },
                { title: 'About', icon: 'question_answer' }
            ]
        }
    },
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer
            EventBus.$emit('toggleDrawer')
        }
    },
    watch: {
        mainDrawer() {
            this.drawer = this.mainDrawer
        },
        drawer () {
            console.log(this.drawer);
            if(!this.drawer) {
                this.toggleDrawer()
            } 
        }
    }
}
</script>

<style>

</style>
