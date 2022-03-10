import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import localStorageKeys from '@/constants/localStorageKeys';
import '@/directives/directives';

Vue.config.productionTip = false;

Vue.use(Vuelidate);

let todos;

try {
  todos = JSON.parse(localStorage.getItem(localStorageKeys.TODOS));
} catch (e) {
}

(async () => {
  if (Array.isArray(todos)) {
    await store.dispatch('setTodos', todos);
  }
})();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
