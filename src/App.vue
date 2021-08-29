<template>
  <div id="app">
    <VMain>
      <VApp>
        <Loader v-show="loader" />
        <component :is="layout">
          <router-view />
        </component>
      </VApp>
    </VMain>
  </div>
</template>

<script>
const defaultLayout = 'Default';

export default {
  name: 'App',
  components: { Loader: () => import('@/components/Loader.vue') },
  computed: {
    layout() {
      return `${this.$route.meta.layout || defaultLayout}Layout`;
    },
    bgImage() {
      return this.$route.meta.backgroundImage;
    },
    loader() {
      return this.$store.getters.loaderActive;
    },
  },
};
</script>

<style lang="sass">
@import '@/styles/style'

#app
  font-family: 'Roboto', sans-serif
  height: 100%
</style>
