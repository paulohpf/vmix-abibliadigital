<template>
  <div id="app">
    <VMain>
      <VApp>
        <component :is="layout">
          <router-view />
        </component>
        <!-- <v-img alt="Vue logo" :src="require('@/assets/logo.png')" />
        <HelloWorld msg="Welcome to Your Vue.js App testeeee" /> -->
      </VApp>
    </VMain>
  </div>
</template>

<script>
const defaultLayout = 'Default';

export default {
  name: 'App',
  components: {
    HelloWorld: () => import('@/components/HelloWorld.vue'),
  },
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
