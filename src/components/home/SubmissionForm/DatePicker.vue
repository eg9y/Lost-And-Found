<template>
    <v-flex xs12>
        <v-menu :close-on-content-click="false" v-model="dateMenu" :nudge-right="40" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
            <v-text-field slot="activator" v-model="computedDateFormatted" label="Date" hint="MM/DD/YYYY format" persistent-hint append-icon="event" readonly></v-text-field>
            <v-date-picker v-model="date" no-title @input="dateMenu = false"></v-date-picker>
        </v-menu>
    </v-flex>
</template>

<script>
import { EventBus } from '../../../main'

export default {
  data () {
    return {
      date: null,
      dateFormatted: null,
      dateMenu: false
    }
  },
  created () {
    const currentDate = new Date()
    let month = (currentDate.getMonth() + 1).toString()
    let date = currentDate.getDate()
    if (month.length === 1) {
      month = '0' + month
    }
    if (date.length === 1) {
      date = '0' + date
    }
    this.date = currentDate.getFullYear() + '-' + month + '-' + date
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },

  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
      EventBus.$emit('setDate', this.dateFormatted)
    }
  },

  methods: {
    formatDate (date) {
      if (!date) {
        return
      }
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>

<style>
</style>
