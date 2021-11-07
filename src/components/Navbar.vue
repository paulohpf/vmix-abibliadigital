<template>
  <nav id="navbar" class="nav">
    <v-app-bar
      height="80"
      color="white"
      elevate-on-scroll
      scroll-target="#versescontainer"
    >
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="inputs.version"
            name="version"
            :items="versions"
            item-value="version"
            :item-text="toUpper"
            label="Versão"
            autocomplete="off"
          />
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="inputs.book"
            name="name"
            label="Livro"
            :items="books"
            item-value="abbrev.pt"
            item-text="name"
            autocomplete="off"
            return-object
          />
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="inputs.chapter"
            name="chapter"
            :items="chapters"
            label="Capitulo"
            autocomplete="off"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="inputs.verses"
            hint="Exemplo: 1-2"
            label="Versiculos"
            autocomplete="off"
            :rules="inputs.rules.verses"
          />
        </v-col>
      </v-row>

      <v-btn icon @click="() => getChapter()">
        <v-icon>{{ icons.mdiMagnify }}</v-icon>
      </v-btn>

      <v-btn icon @click="() => addToList()">
        <v-icon>{{ icons.mdiPlusBox }}</v-icon>
      </v-btn>

      <Settings>
        <v-icon>{{ icons.mdiTools }}</v-icon>
      </Settings>
    </v-app-bar>
  </nav>
</template>

<script>
import { mdiMagnify, mdiFilter, mdiTools, mdiPlusBox } from '@mdi/js';
import BibliaDigitalProvider from '@/providers/abibliadigital';

export default {
  name: 'Navbar',
  components: {
    Settings: () => import('@/components/bible/Settings.vue'),
  },
  data: () => ({
    icons: {
      mdiMagnify,
      mdiFilter,
      mdiTools,
      mdiPlusBox,
    },
    inputs: {
      version: null,
      book: null,
      chapter: null,
      verses: null,
      rules: {
        verses: [
          v => {
            const arr = String(v).split('-');

            return Number(String(arr[0]).trim()) > Number(String(arr[1]).trim())
              ? 'Versiculo inicial maior que final'
              : true;
          },
        ],
      },
    },
  }),
  computed: {
    versions() {
      return this.$store.getters.getVersions;
    },
    books() {
      return this.$store.getters.getBooks;
    },
    chapters() {
      const chapters = [];
      if (this.inputs.book) {
        for (let i = 1; i <= this.inputs.book.chapters; i += 1) {
          chapters.push(i);
        }
      }
      return chapters;
    },
  },
  // updated() {
  //   console.log(this);
  // },
  methods: {
    toUpper(text) {
      return String(text.version).toUpperCase();
    },
    async getChapter() {
      if (this.inputs.version && this.inputs.book && this.inputs.chapter) {
        await BibliaDigitalProvider.getChapter(
          this.inputs.version,
          this.inputs.book.abbrev.pt,
          this.inputs.chapter,
        ).then(res => {
          const { data } = res;

          if (this.inputs.verses) {
            const verses = String(this.inputs.verses).split('-');

            data.verses = data.verses.filter(verse => {
              return verse.number <= Number(String(verses[1]).trim())
                ? verse.number >= Number(String(verses[0]).trim()) &&
                    verse.number <= Number(String(verses[1]).trim())
                : verse.number === Number(String(verses[0]).trim());
            });
          }

          this.$store.commit('setChapter', data);
        });
      }
    },
    async addToList() {
      await this.getChapter();

      if (this.inputs.version && this.inputs.book.name && this.inputs.chapter) {
        this.$store.commit('addChapterToList', {
          name: `${String(this.inputs.version).toUpperCase()} -
          ${this.inputs.book.name} ${this.inputs.chapter}
          ${this.inputs.verses ? `:${this.inputs.verses}` : ''}`,
          version: this.inputs.version,
          book: this.inputs.book,
          chapter: this.inputs.chapter,
          verses: this.inputs.verses,
          versesArr: this.$store.getters.getChapter,
          active: false,
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
