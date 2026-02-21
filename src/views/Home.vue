<template>
  <div class="home pa-4">
    <Navbar />
    <v-row id="versescontainer" class="content-row overflow-y-auto">
      <v-col cols="12" :md="bibleTable.showList ? 8 : 12">
        <div class="d-flex align-center justify-space-between mb-2 header-row">
          <div>
            <h3 class="mb-0">Versículos</h3>
            <small class="text--secondary"
              >{{ verses.length }} registro(s)</small
            >
          </div>
          <v-btn
            small
            outlined
            @click="bibleTable.showList = !bibleTable.showList"
          >
            <v-icon left>
              {{
                bibleTable.showList
                  ? icons.mdiViewList
                  : icons.mdiViewListOutline
              }}
            </v-icon>
            {{ bibleTable.showList ? 'Ocultar Lista' : 'Mostrar Lista' }}
          </v-btn>
        </div>

        <v-data-table
          v-model="bibleTable.selected"
          :headers="bibleTable.headers"
          :items="verses"
          :single-select="bibleTable.singleSelect"
          :items-per-page="bibleTable.itemsPerPage"
          :footer-props="bibleTable.footerProps"
          item-key="number"
          show-select
          dense
          no-data-text="Selecione versão, livro e capítulo para carregar os versículos."
        />
      </v-col>
      <v-col v-if="bibleTable.showList" cols="12" md="4">
        <v-data-table
          :headers="chapterListTable.headers"
          :items="chapterList"
          :items-per-page="chapterListTable.itemsPerPage"
          :footer-props="chapterListTable.footerProps"
          dense
          no-data-text="Nenhuma passagem adicionada ainda."
        >
          <template #item="{ item, index }">
            <tr>
              <td>
                <span class="chapter-name">{{ item.name }}</span>
              </td>
              <td>
                <v-chip x-small :color="item.active ? 'success' : 'grey'" dark>
                  {{ item.active ? 'Sim' : 'Não' }}
                </v-chip>
              </td>
              <td>
                <div class="d-flex align-center">
                  <v-btn
                    small
                    text
                    color="primary"
                    @click="selectChapter(item, index)"
                  >
                    {{ item.active ? 'Ativo' : 'Exibir' }}
                  </v-btn>
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="$store.commit('removeChapterFromList', index)"
                      >
                        <v-icon small>{{ icons.mdiTrashCan }}</v-icon>
                      </v-btn>
                    </template>
                    <span>Remover passagem da lista</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
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
      itemsPerPage: 25,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100],
        'items-per-page-text': 'Linhas por página',
        'page-text': (pageStart, pageStop, itemsLength) =>
          `${pageStart}-${pageStop} de ${itemsLength}`,
      },
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
      itemsPerPage: 10,
      footerProps: {
        'items-per-page-options': [5, 10, 20],
        'items-per-page-text': 'Linhas por página',
        'page-text': (pageStart, pageStop, itemsLength) =>
          `${pageStart}-${pageStop} de ${itemsLength}`,
      },
      headers: [
        {
          text: 'Versiculo',
          align: 'start',
          value: 'name',
        },
        {
          text: 'Ativo',
          align: 'start',
          value: 'active',
          width: 80,
        },
        {
          text: 'Ações',
          align: 'start',
          value: 'actions',
          sortable: false,
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
    selectChapter(chapter, index) {
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

        window.myAPI.saveBibleJson({
          data: versesFormatted,
          nodeEnv: process.env.NODE_ENV,
        });

        this.$store.commit('updateActiveChapterList', index);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.content-row
  max-height: calc(100vh - 110px)

.chapter-name
  display: inline-block
  line-height: 1.3

@media (max-width: 960px)
  .home
    padding: 8px !important

  .content-row
    max-height: calc(100vh - 210px)

  .header-row
    gap: 8px
    align-items: flex-start !important

  .chapter-name
    white-space: normal
</style>
