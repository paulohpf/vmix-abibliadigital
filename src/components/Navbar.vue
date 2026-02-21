<template>
  <nav id="navbar" class="nav">
    <v-app-bar
      height="80"
      color="white"
      elevate-on-scroll
      scroll-target="#versescontainer"
    >
      <v-row dense align="center" class="flex-nowrap">
        <v-col cols="12" md="3">
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
        <v-col cols="12" md="3">
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
          />
        </v-col>
        <v-col cols="12" md="2">
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
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="inputs.verses"
            hint="Exemplo: 1-2"
            label="Versiculos"
            autocomplete="off"
            :rules="inputs.rules.verses"
            dense
            clearable
            hide-details="auto"
            :disabled="!inputs.chapter"
            @keyup.enter="getChapter"
          />
        </v-col>
        <v-col cols="12" md="2" class="d-flex justify-end">
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
    versions() {
      return BibleJSON.getVersions();
    },
    books() {
      return BibleJSON.getBooks(this.inputs.version);
    },
    chapters() {
      return BibleJSON.getChapters(
        this.inputs.version,
        this.inputs.book?.abbrev,
      );
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
      this.$store.commit('setChapter', []);
    },
    getChapter() {
      if (this.canSearch) {
        let chapter = BibleJSON.getChapter(
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
    addToList() {
      if (!this.canAdd) return;

      this.getChapter();
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

<style lang="sass" scoped></style>
