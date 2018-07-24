<!-- Time picker field in the submission form -->

<template>
  <v-flex xs12>
    <v-menu :close-on-content-click="false" v-model="timeMenu" :nudge-right="40" lazy transition="scale-transition" offset-overflow full-width max-width="290px" min-width="290px">
      <v-text-field slot="activator" v-model="picker" label="Time" persistent-hint append-icon="event" readonly></v-text-field>
      <v-time-picker v-model="picker"></v-time-picker>
    </v-menu>
  </v-flex>
</template>

<script>
import { EventBus } from '../../../main'

export default {
  data () {
    return {
      picker: null,
      timeMenu: false
    }
  },
  created () {
    const date = new Date()
    this.picker = date.getHours() + ':' + date.getMinutes()
  },
  watch: {
    picker () {
      EventBus.$emit('setTime', this.picker)
    }
  }
}
</script>
