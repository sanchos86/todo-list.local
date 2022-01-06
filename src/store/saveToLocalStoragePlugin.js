import localStorageKeys from '@/constants/localStorageKeys';

export default (store) => {
  store.subscribe((mutation, state) => {
    const { todos } = state;
    try {
      localStorage.setItem(localStorageKeys.TODOS, JSON.stringify(todos));
    } catch (e) {
    }
  });
};
