import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import router from './router';
import store from './state/store';
import Axios from './plugins/axios';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import './assets/sass/app.scss';

Vue.config.productionTip = false

Vue.use(Axios);
Vue.use(BootstrapVue)

import { CardPlugin } from 'bootstrap-vue';

Vue.use(CardPlugin);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
