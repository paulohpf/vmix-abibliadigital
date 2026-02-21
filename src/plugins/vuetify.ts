import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import pt from 'vuetify/es5/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
  icons: { iconfont: 'mdiSvg' },
  lang: {
    locales: { pt },
    current: 'pt',
  },
});
