<!-- This displays all the items in the database as a list view -->

<template>
  <div>
    <!--Sets the design and displays Lost Items-->
    <list :collectionCluster="clusteredCollections" />
  </div>
</template>

<script>
import List from './List'
import { mapState } from 'vuex'

// Creates a reference to firebase storag

export default {
  components: {
    'list': List
  },
  data () {
    return {
      clusteredCollections: null
    }
  },
  computed: {
    ...mapState([
      'all_lost_items',
      'all_found_items'
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
      this.updateCluster([...this.all_lost_items, ...this.all_found_items])
    }
  },
  watch: {
    breakpoint () {
      this.updateAllClusters()
    },
    all_lost_items () {
      this.updateAllClusters()
    },
    all_found_items () {
      this.updateAllClusters()
    }
  },
  created () {
    if (this.all_lost_items && this.all_found_items) {
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
.project-card {
  margin-right: 10px;
  padding: 0px;
}
.index {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 50px;
  margin-top: 60px;
}
.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}
.item-pictures {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  max-height: 200px;
}
</style>
