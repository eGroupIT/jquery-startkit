if (module.hot) module.hot.accept();

import Vue from 'vue'
import Home from './scenes/Home/view.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { Home },
  template: '<Home/>',
});
