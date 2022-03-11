import Vue from 'vue';
import Vuex from 'vuex';

import saveToLocalStoragePlugin from '@/store/saveToLocalStoragePlugin';

Vue.use(Vuex);

export const getDefaultState = () => ({
  todos: [],
});

export const getters = {
  getTodoById: (state) => (id) => state.todos.find((todo) => todo.id === id),
};

export const mutations = {
  setTodos: (state, todos) => {
    state.todos = todos;
  },
  addTodo: (state, todo) => {
    state.todos.push(todo);
  },
  deleteTodo: (state, id) => {
    state.todos = state.todos.filter((todo) => todo.id !== id);
  },
  editTodo: (state, todo) => {
    for (let i = 0; i < state.todos.length; i++) {
      const originalTodo = state.todos[i];
      if (originalTodo.id === todo.id) {
        state.todos[i] = todo;
        break;
      }
    }
  },
};

export const actions = {
  setTodos: ({ commit }, todos) => {
    commit('setTodos', todos);
  },
  addTodo: ({ commit }, todo) => {
    commit('addTodo', todo);
  },
  deleteTodo: ({ commit }, id) => {
    commit('deleteTodo', id);
  },
  editTodo: ({ commit }, todo) => {
    commit('editTodo', todo);
  },
};

export default new Vuex.Store({
  state: getDefaultState(),
  getters,
  mutations,
  actions,
  plugins: [saveToLocalStoragePlugin],
});
