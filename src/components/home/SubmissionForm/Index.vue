<!-- Pop up dialog that appears when the user clicks the map -->

<template>
  <v-dialog v-model="indexSubmissionForm" :max-width="collapseOrExpandWidth" lazy>
    <!-- if collapsed, hide all the form (give user visibility) -->
      <v-tabs v-show="!hide" centered color="cyan" v-model="activeParent" dark icons-and-text>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab href="#tab-1">
          Add Found Item
          <v-icon>place</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
          Add Lost Item
          <v-icon>place</v-icon>
        </v-tab>

        <!-- Found item form -->
        <v-tab-item :id="'tab-1'">
          <submission-form
            :db="db"
            :firebase="firebase"
            :user="user"
            :lat="lat"
            :lng="lng"
            :activeParent="activeParent"
            :indexSubmissionForm="indexSubmissionForm"
            typeHint="What did you find?"
            descriptionHint="Please describe the item."
            contactHint="Email only"
            collectionName="found-items"/>
        </v-tab-item>

        <!-- Lost item form -->
        <v-tab-item :id="'tab-2'">
          <submission-form
            :db="db"
            :firebase="firebase"
            :user="user"
            :lat="lat"
            :lng="lng"
            :activeParent="activeParent"
            :indexSubmissionForm="indexSubmissionForm"
            typeHint="What did you lose?"
            descriptionHint="Please describe the item."
            contactHint="Email only"
            collectionName="lost-items"/>
        </v-tab-item>
      </v-tabs>
    <v-btn id="hide" @click="hide = true"  v-if="!hide" color="danger" :style="hideButtonStyle" >
      <v-icon left>fas fa-eye-slash</v-icon>  hide
    </v-btn>
    <v-btn id="hide" @click="hide = false"  v-else :style="hideButtonStyle" >
       <v-icon left>fas fa-eye</v-icon> show
    </v-btn>
  </v-dialog>
</template>

<script>
import Form from './Form'
import { mapState } from 'vuex'
import { EventBus } from '../../../main'

export default {
  components: {
    'submission-form': Form
  },
  props: ['lat', 'lng', 'submissionDialog'],
  data () {
    return {
      activeParent: null,
      indexSubmissionForm: null,
      hide: false,
      collapseOrExpandWidth: '450px'
    }
  },
  computed: {
    ...mapState([
      'user',
      'db',
      'firebase'
    ]),
    breakpoint () { return this.$vuetify.breakpoint },
    hideButtonStyle () {
      return {
        top: (this.$vuetify.breakpoint.height - 50) + 'px',
        left: '5px'
      }
    }
  },
  watch: {
    /*
      Expands the form
      (indexSubmissionForm should always have the same value as submissionDialog)
    */
    submissionDialog (val) {
      this.indexSubmissionForm = val
      this.hide = false
    },
    /*
      If form is closed, set the submissionDialog in the parent component to false
    */
    indexSubmissionForm (val) {
      if (!this.indexSubmissionForm) {
        EventBus.$emit('toggleSubmission')
      }
    }
  }
}
</script>
<style scoped>
#hide {
    position: absolute;
}
</style>
