<template>
  <div class="home pa-4">
    <Navbar
      :show-help-toggle="!showHelp && $vuetify.breakpoint.smAndDown"
      @show-help="showHelpAgain"
    />

    <v-alert
      v-if="showHelp"
      class="mb-3"
      border="left"
      colored-border
      type="info"
      dense
      text
    >
      <div class="d-flex align-center justify-space-between mb-1">
        <strong>Ajuda rápida de operação</strong>
        <v-btn small text @click="hideHelp">Ocultar ajuda</v-btn>
      </div>
      <div class="help-text">
        1) Selecione <strong>Versão</strong>, <strong>Livro</strong> e
        <strong>Capítulo</strong>.<br />
        2) (Opcional) Filtre em <strong>Versículos</strong> usando
        <strong>5</strong> ou <strong>5-10</strong>.<br />
        3) Clique em <strong>Buscar</strong> para carregar o texto.<br />
        4) Clique em <strong>Adicionar</strong> para enviar para a lista
        operacional.<br />
        5) Na lista, use <strong>Exibir</strong> para mostrar o texto na
        transmissão.
      </div>
    </v-alert>

    <div
      v-else-if="$vuetify.breakpoint.mdAndUp"
      class="mb-2 d-flex justify-end"
    >
      <v-btn small text color="primary" @click="showHelpAgain">
        <v-icon left small>{{ icons.mdiHelpCircleOutline }}</v-icon>
        Mostrar ajuda rápida
      </v-btn>
    </div>

    <v-row id="versescontainer" class="content-row overflow-y-auto pt-1">
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
          :mobile-breakpoint="0"
          item-key="number"
          show-select
          dense
          no-data-text="Selecione versão, livro e capítulo para carregar os versículos."
        />
      </v-col>
      <v-col v-if="bibleTable.showList" ref="selectedList" cols="12" md="4">
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

    <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      color="primary"
      small
      class="mobile-list-fab"
      @click="openSelectedList"
    >
      <v-icon left small>{{ icons.mdiViewList }}</v-icon>
      Lista ({{ chapterList.length }})
    </v-btn>
  </div>
</template>

<script>
import {
  mdiViewList,
  mdiViewListOutline,
  mdiTrashCan,
  mdiHelpCircleOutline,
} from '@mdi/js';

export default {
  components: {
    Navbar: () => import('@/components/Navbar.vue'),
  },
  data: () => ({
    icons: {
      mdiViewList,
      mdiViewListOutline,
      mdiTrashCan,
      mdiHelpCircleOutline,
    },
    showHelp: true,
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
  created() {
    const hiddenHelp = localStorage.getItem('vmix-biblia-live-hide-help');
    this.showHelp = hiddenHelp !== 'true';
  },
  methods: {
    hideHelp() {
      this.showHelp = false;
      localStorage.setItem('vmix-biblia-live-hide-help', 'true');
    },
    showHelpAgain() {
      this.showHelp = true;
      localStorage.setItem('vmix-biblia-live-hide-help', 'false');
    },
    openSelectedList() {
      this.bibleTable.showList = true;

      this.$nextTick(() => {
        const container = this.$el.querySelector('#versescontainer');
        const selectedList =
          this.$refs.selectedList?.$el || this.$refs.selectedList;

        if (container && selectedList) {
          container.scrollTop = selectedList.offsetTop - 8;
        }
      });
    },
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
  max-height: calc(100vh - 160px)

.chapter-name
  display: inline-block
  line-height: 1.3

.help-text
  line-height: 1.45

@media (max-width: 960px)
  .home
    padding: 8px !important

  .content-row
    max-height: calc(100vh - 250px)

  .header-row
    gap: 8px
    align-items: flex-start !important

  .chapter-name
    white-space: normal

@media (max-width: 600px)
  .content-row
    max-height: calc(100vh - 360px)

  .mobile-list-fab
    position: fixed
    right: 12px
    bottom: 12px
    z-index: 12
</style>
