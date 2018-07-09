<template>
  <div class="add-found-location container z-depth-1">
    <h2 class="center-align indigo-text">Add a Lost and Found</h2>
    <form @submit.prevent="addFound">
      <div class="field type">
        <label for="type">Location Name:</label>
        <input type="text" name="type" v-model="type">
      </div>
      <div class="field location">
        <label for="location">Location:</label>
        <input type="text" name="location" v-model="location">
      </div>  
      <div class="field description">
        <label for="description">Description:</label>
        <input type="text" name="description" v-model="description">
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
  name: 'AddFoundLocation',
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
    addFound(){
        if(this.type){
            this.feedback = null
            db.collection('found-items').add({
                type: this.type,
                locationName: this.locationName,
                location: this.location,
                description: this.description
            })
        }
        else{
            this.feedback = 'You must enter an item type'
        }
    }
  }
}
</script>