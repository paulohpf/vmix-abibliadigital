<template>
  <div class="home">
    <Navbar />
    <v-row
      id="versescontainer"
      class="overflow-y-auto"
      style="max-height: calc(100vh - 80px)"
    >
      <v-col :cols="bibleTable.showList ? 8 : 12">
        <v-btn icon @click="() => (bibleTable.showList = !bibleTable.showList)">
          <v-icon>{{
            bibleTable.showList ? icons.mdiViewList : icons.mdiViewListOutline
          }}</v-icon>
        </v-btn>
        <v-data-table
          v-model="bibleTable.selected"
          :headers="bibleTable.headers"
          :items="verses"
          :single-select="bibleTable.singleSelect"
          item-key="number"
          show-select
        />
      </v-col>
      <v-col v-if="bibleTable.showList" cols="4">
        <v-data-table :headers="chapterListTable.headers" :items="chapterList">
          <template #item="{ item, index }">
            <tr>
              <td>{{ item.name }}</td>
              <td>
                <tr>
                  <td>
                    <v-simple-checkbox
                      v-model="item.active"
                      disabled
                      @click="
                        () => {
                          showChapter(JSON.stringify(item));
                          $store.commit('updateActiveChapterList', index);
                        }
                      "
                    />
                  </td>
                  <td>
                    <v-btn
                      icon
                      @click="
                        () => {
                          $store.commit('removeChapterFromList', index);
                        }
                      "
                    >
                      <v-icon>{{ icons.mdiTrashCan }}</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <div></div>
  </div>
</template>

<script>
import { mdiViewList, mdiViewListOutline, mdiTrashCan } from '@mdi/js';

export default {
  components: {
    Navbar: () => import('@/components/Navbar.vue'),
  },
  data: () => ({
    icons: {
      mdiViewList,
      mdiViewListOutline,
      mdiTrashCan,
    },
    bibleTable: {
      singleSelect: false,
      showList: false,
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
    chapterListTable: {
      headers: [
        {
          text: 'Versiculo',
          align: 'start',
          value: 'name',
        },
        {
          text: 'Ações',
          align: 'start',
          value: '',
        },
      ],
    },
  }),
  computed: {
    verses() {
      if (this.$store.getters.getChapter) {
        return this.$store.getters.getChapter;
      }
      return [];
    },
    chapterList() {
      if (this.$store.getters.getChapterList) {
        return this.$store.getters.getChapterList;
      }
      return [];
    },
  },
  methods: {
    showChapter(chapterJSON) {
      const chapter = JSON.parse(chapterJSON);

      if (window.myAPI && !chapter.active) {
        const versesFormatted = [];
        const versesUnformatted = chapter.versesArr;

        for (let i = 0; i < versesUnformatted.length; i += 1) {
          const versesFormattedIndex = versesFormatted.length - 1;

          if (
            versesFormatted[versesFormattedIndex]?.text.length +
              versesUnformatted[i].text.length <
            342
          ) {
            versesFormatted[
              versesFormattedIndex
            ].text += `\n${versesUnformatted[i].number} ${versesUnformatted[i].text}`;
          } else {
            versesFormatted.push({
              text: `${versesUnformatted[i].number} ${versesUnformatted[i].text}`,
              info: `${chapter.book.name} ${chapter.chapter}${
                chapter.verses ? `:${chapter.verses}` : ``
              } (${String(chapter.version).toUpperCase()})`,
            });
          }
        }

        window.myAPI.saveBibleJson(versesFormatted);
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
