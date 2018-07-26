<!-- This displays all the items in the database as a list view -->

<template>
  <div>
    <!-- Search bar to search submission by item type -->
    <!-- <search-panel></search-panel> -->

    <!--Sets the design and displays Lost Items-->
    <list :collectionCluster="clusteredCollections" />
  </div>
</template>

<script>
import List from './List'
import SearchPanel from './SearchPanel'
import { mapState } from 'vuex'

// Creates a reference to firebase storag

export default {
  components: {
    'list': List,
    'search-panel': SearchPanel
  },
  data () {
    return {
      clusteredCollections: null,
      protectedAllLostItems: [],
      protectedAllFoundItems: []
    }
  },
  computed: {
    ...mapState([
      'all_lost_items',
      'all_found_items',
      'queried_found_items',
      'queried_lost_items'
    ]),
    breakpoint () { return this.$vuetify.breakpoint }
  },
  methods: {
    updateCluster (collection) {
      let group = []
      let limit = 0
      let cluster = 0
      let clusters = []
      if (!this.$vuetify.breakpoint) {
        limit = 1
      } else {
        if (this.$vuetify.breakpoint.width < 500) {
          limit = 1
        } else if (this.$vuetify.breakpoint.width < 612) {
          limit = 2
        } else if (this.$vuetify.breakpoint.width < 885) {
          limit = 3
        } else {
          limit = 4
        }
      }
      if (collection && collection.length) {
        collection.forEach((submission, index) => {
          group.push(submission)
          cluster++
          if (cluster === limit || collection.length - 1 === index) {
            clusters.push(group)
            group = []
            cluster = 0
          }
        })
        this.clusteredCollections = clusters
      }
    },
    updateAllClusters () {
      if (!this.$route.query.search) {
        this.updateCluster([...this.protectedAllLostItems, ...this.protectedAllFoundItems])
      } else {
        this.updateCluster([...this.queried_lost_items, ...this.queried_found_items])
      }
    }
  },
  watch: {
    breakpoint () {
      this.updateAllClusters()
    },
    '$route.query.search': {
      immediate: true,
      async handler (val) {
        if (!val || !val.length) {
          this.updateAllClusters()
          return
        }
        this.$store.dispatch('updateCollectionQuery', val)
        console.log('d22')
      }
    },
    all_lost_items (collection) {
      if (collection && collection.length) {
        if (!this.protectedAllFoundItems) {
          this.protectedAllFoundItems = []
        }
        this.protectedAllLostItems = collection
        console.log('ddd', collection)
        this.updateCluster([...this.protectedAllLostItems, ...this.protectedAllFoundItems])
      }
    },
    all_found_items (collection) {
      if (collection && collection.length) {
        if (!this.protectedAllLostItems) {
          this.protectedAllLostItems = []
        }
        this.protectedAllFoundItems = collection
        this.updateCluster([...this.protectedAllLostItems, ...this.protectedAllFoundItems])
      }
    },
    queried_found_items (collection) {
      this.updateCluster([...this.queried_lost_items, ...this.queried_found_items])
    }
  },
  created () {
    this.protectedAllLostItems = this.all_lost_items
    this.protectedAllFoundItems = this.all_found_items
    let lostItemsAvailable = this.protectedAllLostItems && this.protectedAllLostItems.length
    let foundItemsAvailable = this.protectedAllFoundItems && this.protectedAllFoundItems.length
    if (lostItemsAvailable && foundItemsAvailable) {
      this.updateAllClusters()
    }
  }
}
</script>

<style>
img {
  width: 100%;
  height: auto;
}
</style>
