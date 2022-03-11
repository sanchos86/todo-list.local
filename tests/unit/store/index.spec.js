import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import {
  getDefaultState,
  mutations,
  actions,
  getters,
} from '@/store';
import priorities from '@/constants/priorities';

const createTodo = (description = 'Fake description') => ({
  id: uuidv4(),
  priority: priorities.low,
  description,
});

const createTodos = (length) => Array.from({ length })
  .map((_, index) => createTodo(`Description #${index}`));

describe('store/index.spec.js', () => {
  describe('mutations', () => {
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        state: getDefaultState(),
        mutations,
      });
    });

    it('should set todos to state', () => {
      const todos = createTodos(5);

      store.commit('setTodos', todos);
      expect(store.state.todos).toEqual(todos);
    });

    it('should add todo to state', () => {
      const todo = createTodo();

      store.commit('addTodo', todo);
      expect(store.state.todos).toContainEqual(todo);
    });

    it('should delete todo from todos list by id', () => {
      const length = 3;
      const todos = createTodos(length);
      const todoToDelete = todos[length - 1];
      store.commit('setTodos', todos);
      expect(store.state.todos).toContainEqual(todoToDelete);

      store.commit('deleteTodo', todoToDelete.id);
      expect(store.state.todos).not.toContainEqual(todoToDelete);
    });

    it('should replace existing todo with passed todo if their id is equal', () => {
      const length = 3;
      const todos = createTodos(length);
      const todoToEdit = todos[length - 1];
      store.commit('setTodos', todos);
      expect(store.state.todos).toContainEqual(todoToEdit);
      const editedTodo = {
        id: todoToEdit.id,
        description: 'Lorem ipsum',
        priority: priorities.high,
      };

      store.commit('editTodo', editedTodo);
      expect(store.state.todos).not.toContainEqual(todoToEdit);
      expect(store.state.todos).toContainEqual(editedTodo);
    });
  });

  describe('actions', () => {
    // eslint-disable-next-line no-shadow
    const mutations = {
      setTodos: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      editTodo: jest.fn(),
    };
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        state: getDefaultState(),
        mutations,
        actions,
      });
    });

    it('should commit setTodos mutation with expected arguments', async () => {
      const todos = createTodos(5);
      await store.dispatch('setTodos', todos);

      expect(mutations.setTodos).toHaveBeenCalled();
      expect(mutations.setTodos.mock.calls[0][1]).toEqual(todos);
    });

    it('should commit addTodo mutation with expected arguments', async () => {
      const todo = createTodo();
      await store.dispatch('addTodo', todo);

      expect(mutations.addTodo).toHaveBeenCalled();
      expect(mutations.addTodo.mock.calls[0][1]).toEqual(todo);
    });

    it('should commit deleteTodo mutation with expected arguments', async () => {
      const id = uuidv4();
      await store.dispatch('deleteTodo', id);

      expect(mutations.deleteTodo).toHaveBeenCalled();
      expect(mutations.deleteTodo.mock.calls[0][1]).toEqual(id);
    });

    it('should commit editTodo mutation with expected arguments', async () => {
      const todo = createTodo();
      await store.dispatch('editTodo', todo);

      expect(mutations.editTodo).toHaveBeenCalled();
      expect(mutations.editTodo.mock.calls[0][1]).toEqual(todo);
    });
  });

  describe('getters', () => {
    let store;

    beforeEach(() => {
      store = new Vuex.Store({
        state: getDefaultState(),
        mutations,
        getters,
      });
    });

    it('should find todo by id and return it or return undefined if no todo found', () => {
      const nonExistentId = 1;
      const length = 3;
      const todos = createTodos(length);
      const todoToFind = todos[length - 1];
      store.commit('setTodos', todos);
      expect(getters.getTodoById(store.state)(todoToFind.id)).toEqual(todoToFind);
      expect(getters.getTodoById(store.state)(nonExistentId)).toBeUndefined();
    });
  });
});
