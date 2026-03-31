<template>
  <div class="bible-passage-panel mb-4">
    <v-row dense align="start" class="fields-row">
      <v-col cols="12" sm="6" md="6" lg="3">
        <v-autocomplete
          v-model="inputs.version"
          name="version"
          :items="versions"
          item-value="abbrev"
          :item-text="toUpper"
          label="Versão"
          autocomplete="off"
          dense
          outlined
          hide-details="auto"
          clearable
        />
      </v-col>

      <v-col cols="12" sm="6" md="6" lg="3">
        <v-autocomplete
          v-model="inputs.book"
          name="name"
          label="Livro"
          :items="books"
          item-value="abbrev"
          item-text="name"
          autocomplete="off"
          return-object
          dense
          outlined
          hide-details="auto"
          clearable
          :disabled="!inputs.version"
          :loading="loadingBooks"
        />
      </v-col>

      <v-col cols="12" sm="6" md="6" lg="3">
        <v-autocomplete
          v-model="inputs.chapter"
          name="chapter"
          :items="chapters"
          label="Capítulo"
          autocomplete="off"
          dense
          outlined
          hide-details="auto"
          clearable
          :disabled="!inputs.book"
          :loading="loadingChapters"
        />
      </v-col>

      <v-col cols="12" sm="6" md="6" lg="3">
        <v-text-field
          v-model="inputs.verses"
          placeholder="Ex.: 5 ou 5-10"
          :hint="versesHint"
          label="Versículos"
          autocomplete="off"
          :rules="inputs.rules.verses"
          dense
          outlined
          clearable
          persistent-hint
          hide-details="auto"
          :disabled="!inputs.chapter"
          @keyup.enter="getChapter"
        />
      </v-col>
    </v-row>

    <v-row dense class="actions-row">
      <v-col cols="12">
        <div class="action-buttons d-flex align-center">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                color="primary"
                class="action-btn-main"
                :disabled="!canSearch"
                v-bind="attrs"
                v-on="on"
                @click="getChapter"
              >
                <v-icon left small>{{ icons.mdiMagnify }}</v-icon>
                Buscar
              </v-btn>
            </template>
            <span>Buscar capítulo selecionado</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                outlined
                color="primary"
                class="action-btn-main"
                :disabled="!canAdd"
                v-bind="attrs"
                v-on="on"
                @click="addToList"
              >
                <v-icon left small>{{ icons.mdiPlusBox }}</v-icon>
                Adicionar à fila
              </v-btn>
            </template>
            <span>Adicionar passagem na fila</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="clearFilters">
                <v-icon>{{ icons.mdiFilterOff }}</v-icon>
              </v-btn>
            </template>
            <span>Limpar filtros e resultados</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiMagnify, mdiPlusBox, mdiFilterOff } from '@mdi/js';
import { buildBibleExportData, createId } from '@/store/content/helpers';
import BibleJSON from '@/providers/biblejson';

export default {
  name: 'BiblePassagePanel',
  data: () => ({
    icons: {
      mdiMagnify,
      mdiPlusBox,
      mdiFilterOff,
    },
    versions: BibleJSON.getVersions(),
    books: [],
    chapters: [],
    loadingBooks: false,
    loadingChapters: false,
    loadingChapterVerses: false,
    chapterVersesCount: null,
    inputs: {
      version: null,
      book: null,
      chapter: null,
      verses: null,
      rules: {
        verses: [
          v => {
            if (!v) return true;
            const arr = String(v).split('-');

            if (arr.length === 1) return true;
            if (arr.length > 2) return 'Formato inválido';

            return Number(String(arr[0]).trim()) > Number(String(arr[1]).trim())
              ? 'Versículo inicial maior que final'
              : true;
          },
        ],
      },
    },
  }),
  computed: {
    canSearch() {
      return Boolean(
        this.inputs.version && this.inputs.book?.abbrev && this.inputs.chapter,
      );
    },
    canAdd() {
      return this.canSearch;
    },
    versesHint() {
      if (!this.inputs.chapter) return 'Filtre um versículo ou intervalo';
      if (this.loadingChapterVerses) {
        return 'Carregando quantidade de versículos...';
      }
      return this.chapterVersesCount !== null
        ? `Capítulo com ${this.chapterVersesCount} versículo(s)`
        : 'Filtre um versículo ou intervalo';
    },
  },
  watch: {
    'inputs.version': {
      handler: async function handleVersionChange(version) {
        this.inputs.book = null;
        this.inputs.chapter = null;
        this.inputs.verses = null;
        this.chapters = [];
        this.chapterVersesCount = null;

        if (!version) {
          this.books = [];
          return;
        }

        this.loadingBooks = true;
        this.books = await BibleJSON.getBooks(version);
        this.loadingBooks = false;
      },
    },
    'inputs.book': {
      handler: async function handleBookChange(book) {
        this.inputs.chapter = null;
        this.inputs.verses = null;
        this.chapterVersesCount = null;

        if (!book?.abbrev || !this.inputs.version) {
          this.chapters = [];
          return;
        }

        this.loadingChapters = true;
        this.chapters = await BibleJSON.getChapters(
          this.inputs.version,
          book.abbrev,
        );
        this.loadingChapters = false;
      },
    },
    'inputs.chapter': {
      handler: async function handleChapterChange(chapter) {
        this.inputs.verses = null;
        this.chapterVersesCount = null;

        if (!chapter || !this.inputs.version || !this.inputs.book?.abbrev) {
          return;
        }

        this.loadingChapterVerses = true;
        const chapterData = await BibleJSON.getChapter(
          this.inputs.version,
          this.inputs.book.abbrev,
          chapter,
        );
        this.chapterVersesCount = chapterData.length;
        this.loadingChapterVerses = false;
      },
    },
  },
  methods: {
    toUpper(text) {
      return text.name;
    },
    clearFilters() {
      this.inputs.version = null;
      this.inputs.book = null;
      this.inputs.chapter = null;
      this.inputs.verses = null;
      this.books = [];
      this.chapters = [];
      this.chapterVersesCount = null;
      this.$store.commit('setCurrentBibleChapter', []);
    },
    async getChapter() {
      if (!this.canSearch) return null;

      let chapter = await BibleJSON.getChapter(
        this.inputs.version,
        this.inputs.book.abbrev,
        this.inputs.chapter,
      );

      if (this.inputs.verses) {
        const verses = String(this.inputs.verses).split('-');
        chapter = chapter.filter(verse => {
          return verse.number <= Number(String(verses[1]).trim())
            ? verse.number >= Number(String(verses[0]).trim()) &&
                verse.number <= Number(String(verses[1]).trim())
            : verse.number === Number(String(verses[0]).trim());
        });
      }

      this.$store.commit('setCurrentBibleChapter', chapter);
      return chapter;
    },
    async addToList() {
      if (!this.canAdd) return;

      await this.getChapter();
      const versesArr = this.$store.getters.getCurrentBibleChapter;

      if (
        this.inputs.version &&
        this.inputs.book?.name &&
        this.inputs.chapter
      ) {
        this.$store.commit('addContentToList', {
          id: createId('bible'),
          type: 'bible',
          name: `${String(this.inputs.version).toUpperCase()} - ${
            this.inputs.book.name
          } ${this.inputs.chapter}${
            this.inputs.verses ? `: ${this.inputs.verses}` : ''
          }`,
          version: this.inputs.version,
          book: this.inputs.book,
          chapter: this.inputs.chapter,
          verses: this.inputs.verses,
          versesArr,
          active: false,
          exportData: buildBibleExportData(versesArr, {
            book: this.inputs.book,
            chapter: this.inputs.chapter,
            verses: this.inputs.verses,
            version: this.inputs.version,
          }),
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.bible-passage-panel
  border: 1px solid rgba(0, 0, 0, 0.08)
  border-radius: 12px
  padding: 12px

.fields-row
  margin-bottom: 6px

.actions-row
  margin-top: 0

.action-buttons
  align-items: center
  flex-wrap: wrap
  gap: 8px
  justify-content: flex-end

.action-btn-main
  min-width: 122px

@media (max-width: 1264px)
  .fields-row
    margin-bottom: 4px

  .action-buttons
    justify-content: flex-start

  .action-btn-main
    min-width: 140px

@media (max-width: 960px)
  .bible-passage-panel
    padding: 10px

  .action-btn-main
    min-width: 126px

@media (max-width: 600px)
  .action-buttons
    justify-content: flex-start
    width: 100%

    .v-btn
      min-width: 120px
      min-height: 42px
</style>
