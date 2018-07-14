<template>
    <v-layout>
        <v-flex class="mb-2 mt-2">
            <div class="white elevation-2">
                <v-toolbar flat dense color="primary" dark>
                    <v-toolbar-title>{{title}}</v-toolbar-title>
                    <slot name="action" />
                </v-toolbar>
                <div class="pl-4 pr-4 pt-2 pb-2">
                    <slot>
                        No slot content defined.
                    </slot>
                </div>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style>
</style>
