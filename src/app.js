import Vue from 'vue'

import App from './App.vue'
import router from './router'
import './store'

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})

if (typeof vm === 'undefined') console.log('Error')
