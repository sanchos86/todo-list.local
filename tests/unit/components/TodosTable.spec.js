import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import TodosTable from '@/components/TodosTable.vue';
import test from '@/directives/test';
import priorities from '@/constants/priorities';

const todosLength = 3;
const actions = {
  deleteTodo: jest.fn().mockResolvedValue(null),
};
const todos = Array.from({ length: todosLength }).map((_, index) => ({
  id: uuidv4(),
  description: `Fake description #${index + 1}`,
  priority: priorities.high.value,
}));

const createWrapper = (extraOptions = {}) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      todos,
    },
    actions,
  });
  const defaultOptions = {
    directives: {
      test,
    },
    stubs: {
      RouterLink: RouterLinkStub,
    },
    localVue,
    store,
  };
  const options = { ...defaultOptions, ...extraOptions };
  return mount(TodosTable, options);
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('TodosTable.vue', () => {
  it('should dispatch deleteTodo action with todo id when delete todo button exist and was clicked', async () => {
    const rowIndex = 0;
    const todoItem = todos[rowIndex];
    const wrapper = createWrapper();
    const actionSlots = wrapper.findAll('[data-test-id="actions"]');
    const actionSlot = actionSlots.at(rowIndex);
    const deleteTodoButton = actionSlot.find('[data-test-id="delete-todo-button"]');
    expect(deleteTodoButton.exists()).toBe(true);

    await deleteTodoButton.trigger('click');

    expect(actions.deleteTodo).toHaveBeenCalledTimes(1);
    expect(actions.deleteTodo.mock.calls[0][1]).toBe(todoItem.id);
  });

  it('should render "index + 1" number in number slot', () => {
    const rowIndexFirst = 0;
    const rowIndexLast = todosLength - 1;
    const wrapper = createWrapper();
    const numbers = wrapper.findAll('[data-test-id="number"]');

    expect(numbers.at(rowIndexFirst).text()).toBe(String(rowIndexFirst + 1));
    expect(numbers.at(rowIndexLast).text()).toBe(String(rowIndexLast + 1));
  });

  it('should render router link with expected props and delete todo button', () => {
    const rowIndex = todosLength - 1;
    const todoItem = todos[rowIndex];
    const wrapper = createWrapper();
    const actionSlots = wrapper.findAll('[data-test-id="actions"]');
    const actionSlot = actionSlots.at(rowIndex);
    const routerLink = actionSlot.findComponent(RouterLinkStub);

    expect(routerLink.exists()).toBe(true);
    expect(routerLink.props('to')).toEqual({ name: 'EditTodo', params: { id: todoItem.id } });
  });
});
