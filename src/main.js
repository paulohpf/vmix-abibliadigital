import Vue from 'vue';
import App from '@/App.vue';

import vuetify from '@/plugins/vuetify';
import router from '@/router';

Vue.config.productionTip = false;

Vue.component('DefaultLayout', () => import('@/layouts/Default.vue'));

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
