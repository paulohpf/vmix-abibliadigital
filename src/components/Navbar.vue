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
            item-value="abbrev"
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
            item-value="abbrev"
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

      <!-- <Settings>
        <v-icon>{{ icons.mdiTools }}</v-icon>
      </Settings> -->
    </v-app-bar>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiMagnify, mdiFilter, mdiTools, mdiPlusBox } from '@mdi/js';
import { BibleJSONProvider } from '../providers/biblejson';

interface BookInfo {
  name: string;
  abbrev: string;
}

interface VerseData {
  number: number;
  text: string;
}

interface NavbarData {
  icons: {
    mdiMagnify: string;
    mdiFilter: string;
    mdiTools: string;
    mdiPlusBox: string;
  };
  inputs: {
    version: string | null;
    book: BookInfo | null;
    chapter: string | number | null;
    verses: string | null;
    rules: {
      verses: Array<(v: unknown) => boolean | string>;
    };
  };
}

export default Vue.extend({
  name: 'Navbar',
  components: {
    // Settings: () => import('@/components/bible/Settings.vue'),
  },
  data(): NavbarData {
    return {
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
            (v) => {
              const arr = String(v).split('-');

              return Number(String(arr[0]).trim()) > Number(String(arr[1]).trim())
                ? 'Versiculo inicial maior que final'
                : true;
            },
          ],
        },
      },
    };
  },
  computed: {
    versions(): Array<{ name: string; abbrev: string }> {
      const bibleJSON = new BibleJSONProvider();
      return bibleJSON.getVersions();
    },
    books(): BookInfo[] {
      const bibleJSON = new BibleJSONProvider();
      return bibleJSON.getBooks(this.inputs.version) as BookInfo[];
    },
    chapters(): number[] {
      const bibleJSON = new BibleJSONProvider();
      return bibleJSON.getChapters(
        this.inputs.version || '',
        this.inputs.book?.abbrev || '',
      );
    },
  },
  methods: {
    toUpper(text: { name: string }): string {
      return text.name;
    },
    getChapter(): VerseData[] | null {
      if (
        this.inputs.version &&
        this.inputs.book?.abbrev &&
        this.inputs.chapter
      ) {
        const bibleJSON = new BibleJSONProvider();
        let chapter = bibleJSON.getChapter(
          this.inputs.version,
          this.inputs.book.abbrev,
          this.inputs.chapter,
        ) as VerseData[];

        if (this.inputs.verses && Array.isArray(chapter)) {
          const verses = String(this.inputs.verses).split('-');

          chapter = chapter.filter((verse) => {
            const verseNum = verse.number;
            const startVerse = Number(String(verses[0]).trim());
            const endVerse = Number(String(verses[1]).trim());
            return verseNum >= startVerse && verseNum <= endVerse;
          });
        }

        this.$store.commit('setChapter', chapter);

        return chapter;
      }

      return null;
    },
    addToList(): void {
      this.getChapter();
      const versesArr = this.$store.getters.getChapter;

      if (
        this.inputs.version &&
        this.inputs.book?.name &&
        this.inputs.chapter
      ) {
        this.$store.commit('addChapterToList', {
          name: `${String(this.inputs.version).toUpperCase()} - ${this.inputs.book.name} ${this.inputs.chapter}${
            this.inputs.verses ? `: ${this.inputs.verses}` : ''
          }`,
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
});
</script>

<style lang="sass" scoped></style>
