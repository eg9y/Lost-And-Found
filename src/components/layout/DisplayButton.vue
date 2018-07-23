<template>
    <div class="text-xs-center">
        <v-menu offset-y>
            <v-btn slot="activator" color="primary" dark>
                Dropdown
            </v-btn>
            <v-list>
                <v-list-tile>
                    <v-checkbox :label="`Checkbox 1: ${checkbox1.toString()}`" v-model="checkbox1"></v-checkbox>
                </v-list-tile>
                <v-list-tile>
                    <v-checkbox :label="`Checkbox 2: ${checkbox2.toString()}`" v-model="checkbox2"></v-checkbox>
                </v-list-tile>
                <v-list-tile>
                    <v-btn block>List View</v-btn>
                </v-list-tile>
                <!-- <v-list-tile
          v-for="(item, index) in items"
          :key="index"
        > -->
                <!-- <v-list-tile-title>{{ item.title }}</v-list-tile-title> -->
                <!-- </v-list-tile> -->
            </v-list>
        </v-menu>
    </div>
</template>

<script>
export default {
  data () {
    return {
      checkbox1: true,
      checkbox2: false
    }
  }
}
</script>
