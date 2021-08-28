<template>
  <v-card class="default-layout">
    <slot />
  </v-card>
</template>

<script>
export default {
  name: 'DefaultLayout',
};
</script>

<style lang="sass" scoped>
.default-layout
  min-height: 100vh
</style>
