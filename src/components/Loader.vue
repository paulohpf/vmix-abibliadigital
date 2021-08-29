<template>
  <transition>
    <v-row class="loading ma-0" justify="center" align="center">
      <v-col class="pa-0 ma-0" align="center" justify="center">
        <v-progress-circular
          class="loader"
          indeterminate
          color="#0984e3"
          size="64"
        />
      </v-col>
    </v-row>
  </transition>
</template>

<script>
export default {
  name: 'Loader',
};
</script>

<style lang="sass" scoped>
.loading
  position: fixed
  top: 0px
  left: 0px
  background-color: rgb(0, 0, 0, 0.3)
  z-index: 9999
  width: 100%
  height: 100%
</style>
