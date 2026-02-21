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

<script lang="ts">
import Vue from 'vue';

const defaultLayout = 'Default';

export default Vue.extend({
  name: 'App',
  components: { Loader: () => import('@/components/Loader.vue') },
  computed: {
    layout(): string {
      const layoutName = this.$route && this.$route.meta ? this.$route.meta.layout : defaultLayout;
      return `${layoutName || defaultLayout}Layout`;
    },
    bgImage(): unknown {
      return this.$route && this.$route.meta ? this.$route.meta.backgroundImage : undefined;
    },
    loader(): boolean {
      return this.$store.getters.loaderActive;
    },
  },
});
</script>

<style lang="sass">
@import '@/styles/style'

#app
  font-family: 'Roboto', sans-serif
  height: 100%
</style>
