<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="type"
      :rules="nameRules"
      :counter="10"
      label="Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="timestamp"
      :rules="nameRules"
      :counter="10"
      label="Timestamp"
      required
    ></v-text-field>
    <v-text-field
      v-model="location"
      :rules="nameRules"
      :counter="10"
      label="Location"
      required
    ></v-text-field>
    <v-text-field
      v-model="contactEmail"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>
    <v-text-field
      v-model="type"
      :rules="nameRules"
      label="Type"
      required
    ></v-text-field>    
    <!-- <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Item is required']"
      label="Item"
      required
    ></v-select> -->

    <v-btn
      :disabled="!valid"
      @click="addLost"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
</template>

<script>
import db from "@/firebase/init";
export default {
  name: "AddLost",
  data() {
    return {
      type: null,
      description: null,
      contactEmail: null,
      location: null,
      timestamp: null
    };
  },
  methods: {
    addLost() {
      if (this.type) {
        this.feedback = null;
        db.collection("lost-items").add({
          type: this.type,
          description: this.description,
          contactEmail: this.contactEmail,
          location: this.location,
          timestamp: this.timestamp
        });
      } else {
        this.feedback = "You must enter an item type";
      }
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>