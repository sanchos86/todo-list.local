import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [],
  },
  mutations: {
    addTodo(state, todo) {
      state.todos.push(todo);
    },
    deleteTodo(state, id) {
      state.todos = state.todos.filter((todo) => todo.id !== id);
    },
  },
  actions: {
    addTodo({ commit }, todo) {
      commit('addTodo', todo);
    },
    deleteTodo({ commit }, id) {
      commit('deleteTodo', id);
    },
  },
  modules: {
  },
});
