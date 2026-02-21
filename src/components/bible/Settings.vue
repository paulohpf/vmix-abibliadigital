<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <slot />
      </v-btn>
    </template>

    <v-card>
      <v-toolbar>
        <v-toolbar-title>Configurações</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="showDialog = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-list three-line subheader>
        <v-subheader
          >Usuário API Biblia Digital -
          {{
            bibleUser.token ? `Conectado - ${bibleUser.name}` : 'Desconectado'
          }}
        </v-subheader>

        <v-list-item-group multiple>
          <v-list-item>
            <v-list-item-action>
              <v-text-field
                v-model="bibliaDigitalUserData.email"
                :rules="rules.emailRules"
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>E-mail</v-list-item-title>
              <v-list-item-subtitle>
                Usuário criado na API em
                <a href="https://www.abibliadigital.com.br/"
                  >https://www.abibliadigital.com.br/</a
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-action>
              <v-text-field
                v-model="bibliaDigitalUserData.password"
                :append-icon="
                  bibliaDigitalUserData.passwordShow
                    ? icons.mdiEye
                    : icons.mdiEyeOff
                "
                :type="bibliaDigitalUserData.passwordShow ? 'text' : 'password'"
                :rules="rules.passwordRules"
                required
                @click:append="
                  bibliaDigitalUserData.passwordShow =
                    !bibliaDigitalUserData.passwordShow
                "
              />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>Senha</v-list-item-title>
              <v-list-item-subtitle> Senha de 6 digitos </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-btn @click="saveUserABibliaDigital">Salvar</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiClose, mdiEye, mdiEyeOff } from '@mdi/js';
import BibliaDigitalProvider from '@/providers/abibliadigital';

interface IconData {
  mdiClose: string;
  mdiEye: string;
  mdiEyeOff: string;
}

interface UserData {
  email: string;
  password: string | null;
  passwordShow: boolean;
}

interface EmailRule {
  (v: unknown): boolean | string;
}

interface ValidationRule {
  emailRules: EmailRule[];
  passwordRules: Array<(v: unknown) => boolean | string>;
}

interface SettingsData {
  icons: IconData;
  showDialog: boolean;
  bibliaDigitalUserData: UserData;
  rules: ValidationRule;
}

interface BibleUser {
  email?: string;
  name?: string;
  token?: string;
}

export default Vue.extend({
  name: 'BibleSettings',
  data(): SettingsData {
    return {
      icons: {
        mdiClose,
        mdiEye,
        mdiEyeOff,
      },
      showDialog: false,
      bibliaDigitalUserData: {
        email: '',
        password: null,
        passwordShow: false,
      },
      rules: {
        emailRules: [
          (v) => !!v || 'E-mail é obrigatório',
          (v) => /.+@.+\..+/.test(String(v)) || 'E-mail inválido',
        ],
        passwordRules: [(v) => !!v || 'Senha é obrigatória'],
      },
    };
  },
  computed: {
    bibleUser(): BibleUser {
      return this.$store.getters.getBibliaDigitalUserData;
    },
  },
  mounted(): void {
    if (this.bibleUser?.email) {
      this.bibliaDigitalUserData.email = this.bibleUser.email;
    }
  },
  methods: {
    async saveUserABibliaDigital(): Promise<void> {
      console.log(this.bibliaDigitalUserData);
      if (
        this.bibliaDigitalUserData.email &&
        this.bibliaDigitalUserData.password
      ) {
        try {
          const res = await BibliaDigitalProvider.updateToken({
            email: this.bibliaDigitalUserData.email,
            password: this.bibliaDigitalUserData.password,
          });

          if (res.data && (res.data as any).msg === 'User not found') {
            return;
          }

          this.$store.commit('setBibliaDigitalUserData', res.data);

          const versionsRes = await BibliaDigitalProvider.getVersions();
          this.$store.commit('setVersions', versionsRes.data);

          const booksRes = await BibliaDigitalProvider.getBooks();
          this.$store.commit('setBooks', booksRes.data);
        } catch (error) {
          console.error('Error saving user:', error);
        }
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
