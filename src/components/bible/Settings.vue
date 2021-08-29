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
          >Usuário A Biblia Digital -
          {{ bibleUser.token ? 'Conectado' : 'Desconectado' }}
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

<script>
import { mdiClose, mdiEye, mdiEyeOff } from '@mdi/js';
import BibliaDigitalProvider from '@/providers/abibliadigital';

export default {
  name: 'BibleSettings',
  data: () => ({
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
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail inválido',
      ],
      passwordRules: [v => !!v || 'Senha é obrigatória'],
    },
  }),
  computed: {
    bibleUser() {
      return this.$store.getters.getBibliaDigitalUserData;
    },
  },
  updated() {
    console.log(this);
  },
  methods: {
    async saveUserABibliaDigital() {
      console.log(this.bibliaDigitalUserData);
      if (
        this.bibliaDigitalUserData.email &&
        this.bibliaDigitalUserData.password
      ) {
        const res = await BibliaDigitalProvider.updateToken({
          email: this.bibliaDigitalUserData.email,
          password: this.bibliaDigitalUserData.password,
        });

        this.$store.commit('setBibliaDigitalUserData', res.data);
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
