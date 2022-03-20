import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import localStorageKeys from '@/constants/localStorageKeys';
import saveToLocalStoragePlugin from '@/store/saveToLocalStoragePlugin';
import { mutations } from '@/store';
import priorities from '@/constants/priorities';

const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

const createStore = (todos = []) => new Vuex.Store({
  state: {
    todos,
  },
  plugins: [saveToLocalStoragePlugin],
  mutations,
});

const createTodo = (index = 0) => ({
  id: uuidv4(),
  description: `Fake description #${index}`,
  priority: priorities.high.value,
});

const createTodos = (todosLength) => Array.from({ length: todosLength })
  .map((_, index) => createTodo(index));

afterEach(() => {
  setItemSpy.mockClear();
});

describe('saveToLocalStoragePlugin.js', () => {
  it('when setTodos mutation is called then localStorage setItem method should be called with expected arguments', () => {
    const payload = createTodos(3);
    const store = createStore();
    store.commit('setTodos', payload);
    const { todos } = store.state;

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(localStorageKeys.TODOS, JSON.stringify(todos));
  });

  it('when addTodo mutation is called then localStorage setItem method should be called with expected arguments', () => {
    const payload = createTodo();
    const store = createStore();
    store.commit('addTodo', payload);
    const { todos } = store.state;

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(localStorageKeys.TODOS, JSON.stringify(todos));
  });

  it('when deleteTodo mutation is called then localStorage setItem method should be called with expected arguments', () => {
    const payload = createTodos(3)[0].id;
    const store = createStore();
    store.commit('deleteTodo', payload);
    const { todos } = store.state;

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(localStorageKeys.TODOS, JSON.stringify(todos));
  });

  it('when editTodo mutation is called then localStorage setItem method should be called with expected arguments', () => {
    const payload = createTodos(3);
    const todo = payload[0];
    const store = createStore();
    store.commit('editTodo', {
      id: todo.id,
      description: 'Updated description',
      priority: priorities.middle.value,
    });
    const { todos } = store.state;

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(localStorageKeys.TODOS, JSON.stringify(todos));
  });
});
