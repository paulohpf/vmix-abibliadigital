<template>
  <v-container class="login">
    <div class="login-form">
      <v-form
        ref="loginForm"
        v-model="validLogin"
        style="max-width: 700px; margin: auto"
      >
        <v-col>
          <v-text-field
            v-model="inputs.email"
            :rules="rules.emailRules"
            label="E-mail"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="inputs.password"
            :append-icon="passwordShow ? icons.mdiEye : icons.mdiEyeOff"
            :type="passwordShow ? 'text' : 'password'"
            label="Senha"
            :rules="rules.passwordRules"
            required
            @click:append="passwordShow = !passwordShow"
          />
        </v-col>
        <v-col>
          <v-checkbox v-model="stayConnected" label="Permanecer conectado" />
        </v-col>
        <v-col>
          <v-btn :disabled="!validLogin" @click="() => submit()">Entrar</v-btn>
        </v-col>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js';

export default {
  name: 'Login',
  data: () => ({
    icons: {
      mdiEye,
      mdiEyeOff,
    },
    validLogin: true,
    passwordShow: false,
    stayConnected: false,
    inputs: {
      email: '',
      password: '',
    },
    rules: {
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail inválido',
      ],
      passwordRules: [v => !!v || 'Senha é obrigatória'],
    },
  }),
  mounted() {
    console.log(this);
  },
  methods: {
    submit() {
      console.log('.');
      const validate = this.$refs.loginForm.validate();
      if (validate) console.log(this.inputs);
    },
  },
};
</script>

<style lang="sass" scoped>
.login
  display: flex
  justify-content: center
  align-items: center

  .login-form
    padding: 20px
    width: 450px
    border: 1px solid #ecf0f1
    border-radius: 20px
</style>
