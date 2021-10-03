<template>
  <div class="home">
    <Navbar />
    <div
      id="versescontainer"
      class="overflow-y-auto"
      style="max-height: calc(100vh - 80px)"
    >
      <v-data-table
        v-model="bibleTable.selected"
        :headers="bibleTable.headers"
        :items="verses"
        :single-select="bibleTable.singleSelect"
        item-key="number"
        show-select
      />
    </div>
  </div>
</template>

<script>
// import { contextBridge } from 'electron';

export default {
  components: {
    Navbar: () => import('@/components/Navbar.vue'),
  },
  data: () => ({
    bibleTable: {
      singleSelect: false,
      headers: [
        {
          text: 'Capitulo',
          align: 'start',
          value: 'number',
        },
        {
          text: 'Texto',
          align: 'start',
          value: 'text',
        },
      ],
      selected: [],
    },
  }),
  computed: {
    verses() {
      if (this.$store.getters.getChapter.verses) {
        return this.$store.getters.getChapter?.verses;
      }
      return [];
    },
  },
  updated() {
    console.log(this);
    window.myAPI.saveBibleJson(this.bibleTable.selected);
    // ipcRenderer.send('save-bible-json', 'ping');
  },
  methods: {},
};
</script>

<style lang="sass" scoped></style>
