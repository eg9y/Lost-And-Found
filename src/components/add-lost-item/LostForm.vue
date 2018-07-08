<template>
  <div class="add-lost-item container z-depth-1">
    <h2 class="center-align indigo-text">Add a Lost Item</h2>
    <form @submit.prevent="addLost">
      <div class="field type">
        <label for="type">Item Type:</label>
        <input type="text" name="type" v-model="type">
      </div>
      <div class="field description">
        <label for="description">Description:</label>
        <input type="text" name="description" v-model="description">
      </div>
      <div class="field contactEmail">
        <label for="contactEmail">Contact Email:</label>
        <input type="text" name="contactEmail" v-model="contactEmail">
      </div>
      <div class="field location">
        <label for="location">Location:</label>
        <input type="text" name="location" v-model="location">
      </div>
      <div class="field timestamp">
        <label for="timestamp">Timestamp:</label>
        <input type="text" name="timestamp" v-model="timestamp">
      </div>
      

      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Item</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: 'AddLost',
  data(){
    return{
      type: null,
      description: null,
      contactEmail: null,
      location: null,
      timestamp: null
    }
  },
  methods: {
    addLost(){
        if(this.type){
            this.feedback = null
            db.collection('lost-items').add({
                type: this.type,
                description: this.description,
                contactEmail: this.contactEmail,
                location: this.location,
                timestamp: this.timestamp
            })
        }
        else{
            this.feedback = 'You must enter an item type'
        }
    }
  }
}
</script>