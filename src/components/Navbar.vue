<template>
  <nav id="navbar" class="nav">
    <v-app-bar
      height="80"
      color="white"
      elevate-on-scroll
      scroll-target="#versescontainer"
    >
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
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

      <!-- <v-btn icon>
        <v-icon>{{ icons.mdiFilter }}</v-icon>
      </v-btn> -->

      <Settings>
        <v-icon>{{ icons.mdiTools }}</v-icon>
      </Settings>
      <!-- <v-btn icon> </v-btn> -->

      <!-- <v-menu left bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="() => {}">
            <v-list-item-title>Configurações</v-list-item-title>
          </v-list-item>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>
  </nav>
</template>

<script>
import {
  mdiMagnify,
  mdiFilter,
  // mdiDotsVertical,
  mdiTools,
} from '@mdi/js';
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
      // mdiDotsVertical,
      mdiTools,
    },
    inputs: {
      version: '',
      book: '',
      chapter: '',
      verses: '',
      rules: {
        verses: [
          v => {
            const arr = String(v).split('-');
            return arr[0] < arr[1] ? 'Versiculo inicial maior que final' : true;
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

            data.verses = data.verses.filter(
              (verse, index) =>
                index >= verses[0] - 1 && index <= verses[1] - 1,
            );
          }

          this.$store.commit('setChapter', data);
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
