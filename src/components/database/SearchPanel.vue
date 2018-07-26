<template>
  <v-text-field
    prepend-icon="search"
    hide-details
    single-line
    label="Search by type"
    v-model="search">
  </v-text-field>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  },
  watch: {
    search (val) {
      const route = {
        name: 'Database'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search
        }
      }
      this.$router.push(route)
    },
    '$route.query.search': {
      immediate: true,
      handler (val) {
        this.search = val
      }
    }
  }
}
</script>

<style>
</style>
