import store from '@/store'

export default {
  name: 'Home',
  data() {
    return {
      count: 1,
      price: 100,
      store,
    };
  },
  computed: {
    totalPrice: {
      // getter
      get() {
        return this.count * this.price
      },
      // setter
      set(newValue) {
        this.price = newValue / this.count
      },
    },
  },
  methods: {
    increment() {
      this.count += 1
    },
    increment2() {
      this.price += 100
    },
    increment3() {
      store.commit('increment')
    },
  },
};
