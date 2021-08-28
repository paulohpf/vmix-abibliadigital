<template>
  <nav id="navbar" class="nav">
    <v-app-bar
      color="white"
      elevate-on-scroll
      scroll-target="#scrolling-techniques-7"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-select
        :items="versions"
        item-value="version"
        :item-text="toUpper"
        label="Versão"
      />

      <v-spacer />

      <v-select label="Livro" />

      <v-spacer />

      <v-text-field hint="Exemplo: 1:1-2" label="Referência" />

      <v-spacer />

      <v-btn icon>
        <v-icon>{{ icons.mdiMagnify }}</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>{{ icons.mdiFilter }}</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
import { mdiMagnify, mdiFilter, mdiDotsVertical } from '@mdi/js';

export default {
  name: 'Navbar',
  data: () => ({
    icons: {
      mdiMagnify,
      mdiFilter,
      mdiDotsVertical,
    },
  }),
  computed: {
    versions() {
      console.log(this.$store.getters.getVersions);
      return this.$store.getters.getVersions;
    },
  },
  methods: {
    toUpper(text) {
      return String(text.version).toUpperCase();
    },
  },
};
</script>

<style lang="sass" scoped></style>
