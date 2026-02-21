<template>
  <nav id="navbar" class="nav">
    <v-app-bar
      :height="$vuetify.breakpoint.mdAndUp ? 80 : 176"
      color="white"
      elevate-on-scroll
      scroll-target="#versescontainer"
    >
      <v-row dense align="center" class="flex-wrap">
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            v-model="inputs.version"
            name="version"
            :items="versions"
            item-value="abbrev"
            :item-text="toUpper"
            label="Versão"
            autocomplete="off"
            dense
            hide-details="auto"
            clearable
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
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
            hide-details="auto"
            clearable
            :disabled="!inputs.version"
            :loading="loadingBooks"
          />
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-autocomplete
            v-model="inputs.chapter"
            name="chapter"
            :items="chapters"
            label="Capitulo"
            autocomplete="off"
            dense
            hide-details="auto"
            clearable
            :disabled="!inputs.book"
            :loading="loadingChapters"
          />
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <v-text-field
            v-model="inputs.verses"
            placeholder="Ex.: 5 ou 5-10"
            :hint="versesHint"
            label="Versiculos"
            autocomplete="off"
            :rules="inputs.rules.verses"
            dense
            clearable
            persistent-hint
            hide-details="auto"
            :disabled="!inputs.chapter"
            @keyup.enter="getChapter"
          />
        </v-col>

        <v-col
          cols="12"
          md="2"
          class="d-flex justify-center justify-md-end action-buttons"
        >
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                :disabled="!canSearch"
                v-bind="attrs"
                v-on="on"
                @click="getChapter"
              >
                <v-icon>{{ icons.mdiMagnify }}</v-icon>
              </v-btn>
            </template>
            <span>Buscar capítulo selecionado</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                :disabled="!canAdd"
                v-bind="attrs"
                v-on="on"
                @click="addToList"
              >
                <v-icon>{{ icons.mdiPlusBox }}</v-icon>
              </v-btn>
            </template>
            <span>Adicionar passagem na lista</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="clearFilters">
                <v-icon>{{ icons.mdiFilterOff }}</v-icon>
              </v-btn>
            </template>
            <span>Limpar filtros e resultados</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-app-bar>
  </nav>
</template>

<script>
import { mdiMagnify, mdiPlusBox, mdiFilterOff } from '@mdi/js';
// import BibliaDigitalProvider from '@/providers/abibliadigital';
import BibleJSON from '../providers/biblejson';

export default {
  name: 'Navbar',
  components: {
    // Settings: () => import('@/components/bible/Settings.vue'),
  },
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
              ? 'Versiculo inicial maior que final'
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
      if (!this.inputs.chapter) {
        return 'Filtre um versículo ou intervalo';
      }

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
      this.$store.commit('setChapter', []);
    },
    async getChapter() {
      if (this.canSearch) {
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

        this.$store.commit('setChapter', chapter);

        return chapter;
      }

      return null;
    },
    async addToList() {
      if (!this.canAdd) return;

      await this.getChapter();
      const versesArr = this.$store.getters.getChapter;

      if (
        this.inputs.version &&
        this.inputs.book?.name &&
        this.inputs.chapter
      ) {
        this.$store.commit('addChapterToList', {
          name: `${String(this.inputs.version).toUpperCase()} -
          ${this.inputs.book.name} ${this.inputs.chapter}
          ${this.inputs.verses ? `: ${this.inputs.verses}` : ''}`,
          version: this.inputs.version,
          book: this.inputs.book,
          chapter: this.inputs.chapter,
          verses: this.inputs.verses,
          versesArr,
          active: false,
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.action-buttons
  gap: 4px

@media (max-width: 960px)
  .nav
    .v-toolbar__content
      align-items: flex-start
</style>
