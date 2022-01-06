import Vue from 'vue';
import Vuex from 'vuex';

import saveToLocalStoragePlugin from '@/store/saveToLocalStoragePlugin';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [],
  },
  mutations: {
    setTodos(state, todos) {
      state.todos = todos;
    },
    addTodo(state, todo) {
      state.todos.push(todo);
    },
    deleteTodo(state, id) {
      state.todos = state.todos.filter((todo) => todo.id !== id);
    },
  },
  actions: {
    setTodos({ commit }, todos) {
      commit('setTodos', todos);
    },
    addTodo({ commit }, todo) {
      commit('addTodo', todo);
    },
    deleteTodo({ commit }, id) {
      commit('deleteTodo', id);
    },
  },
  modules: {
  },
  plugins: [saveToLocalStoragePlugin],
});
