import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: 'mdiSvg',
  },
  breakpoint: {
    mobileBreakpoint: 768,
  },
  theme: {
    themes: {
      light: {
        primary: '#04a64b',
        secondary: '#172542',
        accent: '#000000',
      },
    },
  },
};

export default new Vuetify(opts);
