import Vue from 'vue'
import Vuex from 'vuex'

import App from './App.vue'
import router from './router';
import store from './store';

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});