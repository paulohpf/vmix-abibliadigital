<template>
  <div class="home">
    <Navbar />
    <div
      id="versescontainer"
      class="overflow-y-auto"
      style="max-height: calc(100vh - 80px)"
    >
      {this.store.getters.getChapter}
      <v-data-table
        v-model="bibleTable.selected"
        :headers="bibleTable.headers"
        :items="chapter.verses"
        show-select
      />
    </div>
  </div>
</template>

<script>
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
    chapter() {
      if (this.$store.getters.getChapter.verses) {
        return this.$store.getters.getChapter;
      }
      return [];
    },
  },
  updated() {
    console.log(this);
  },
  methods: {},
};
</script>

<style lang="sass" scoped></style>
