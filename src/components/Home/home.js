import store from '@/store';

export default {
  name: 'Home',
  data() {
    return {
      count: 1,
      price: 100,
      store
    };
  },
  computed: {
    totalPrice: {
      // getter
      get: function () {
        return this.count * this.price
      },
      // setter
      set: function (newValue) {
        this.price = newValue / this.count
      }
    }
  },
  methods: {
    increment: function() {
      this.count += 1
    },
    increment2: function() {
      this.price += 100
    },
    increment3: function() {
      store.commit('increment')
    }
  }
};