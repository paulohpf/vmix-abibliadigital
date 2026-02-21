<template>
  <v-card class="default-layout">
    <slot />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DefaultLayout',
});
</script>

<style lang="sass" scoped>
.default-layout
  min-height: 100vh
</style>
