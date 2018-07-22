<template>
  <!-- // POP UP SUBMISSION FORM -->
  <v-dialog v-model="indexSubmissionForm" max-width="450px" lazy>
    <v-tabs centered color="cyan" v-model="activeParent" dark icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#tab-1">
        Add Found Item
        <v-icon>place</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Add Lost Item
        <v-icon>place</v-icon>
      </v-tab>

      <!-- // FOUND ITEM form -->
      <v-tab-item :id="'tab-1'">
        <submission-form
          :db="db"
          :firebase="firebase"
          :user="user"
          :lat = "lat"
          :lng = "lng"
          :activeParent = "activeParent"
          typeHint="What did you find?"
          descriptionHint="Please describe the item."
          contactHint="Email only"
          collectionName="found-items"
        />
      </v-tab-item>

      <!-- // LOST ITEM form -->
      <v-tab-item :id="'tab-2'">
        <submission-form
          :db="db"
          :firebase="firebase"
          :user="user"
          :lat = "lat"
          :lng = "lng"
          :activeParent = "activeParent"
          typeHint="What did you lose?"
          descriptionHint="Please describe the item."
          contactHint="Email only"
          collectionName="lost-items"
        />
      </v-tab-item>
    </v-tabs>
  </v-dialog>
</template>

<script>
import Form from './Form'
import { mapState } from 'vuex'

// import event bus for child to parent communication
import { EventBus } from '../../../main'

export default {
  components: {
    'submission-form': Form
  },
  props: ['lat', 'lng', 'submissionDialog'],
  computed: {
    ...mapState([
      'user',
      'db',
      'firebase'
    ])
  },
  data () {
    return {
      activeParent: null,
      indexSubmissionForm: null
    }
  },
  watch: {
    submissionDialog (val) {
      this.indexSubmissionForm = val
    },
    indexSubmissionForm (val) {
      if (!this.indexSubmissionForm) {
        EventBus.$emit('toggleSubmission')
      }
    }
  }
}
</script>
