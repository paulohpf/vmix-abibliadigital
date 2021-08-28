import Vue from 'vue';

import App from '@/App.vue';
import router from '@/router';
import vuetify from '@/plugins/vuetify';

Vue.config.productionTip = false;

Vue.component('DefaultLayout', () => import('@/layouts/Default.vue'));

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');