import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vuelidate from 'vuelidate';
import { v4 as uuidv4 } from 'uuid';
import mergeDeep from 'merge-deep';

import EditTodoForm from '@/components/EditTodoForm.vue';
import test from '@/directives/test';
import priorities from '@/constants/priorities';
import { getters } from '@/store';

const actions = {
  editTodo: jest.fn().mockResolvedValue(null),
};
const todos = Array.from({ length: 3 }).map((_, index) => ({
  id: uuidv4(),
  description: `Fake description #${index}`,
  priority: priorities.high.value,
}));

const createWrapper = (options = {}) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(Vuelidate);
  const store = options.store ?? new Vuex.Store({
    state: {
      todos,
    },
    actions,
    getters,
  });
  const defaultOptions = {
    directives: {
      test,
    },
    mocks: {
      $router: {
        push: jest.fn().mockResolvedValue(null),
      },
      $route: {
        params: {},
      },
    },
    localVue,
    store,
  };
  const mergedOptions = mergeDeep(defaultOptions, options.options ?? {});
  return shallowMount(EditTodoForm, mergedOptions);
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('EditTodoForm.vue', () => {
  describe('should correctly validate different data sets', () => {
    const wrapper = createWrapper();

    const formData = [
      [{ form: { description: 'hello', priority: '' } }, true],
      [{ form: { description: 'hello', priority: priorities.high.value } }, true],
      [{ form: { description: 'hello world', priority: '' } }, true],
      [{ form: { description: '', priority: priorities.high.value } }, true],
      [{ form: { description: 'hello world', priority: priorities.high.value } }, false],
    ];

    it('computed isFormInvalid is true with initial form values', () => {
      const { isFormInvalid } = wrapper.vm;

      expect(isFormInvalid).toBe(true);
    });

    it.each(formData)('when form data is %j then computed isFormInvalid should be %p', async (data, expected) => {
      await wrapper.setData(data);
      const { isFormInvalid } = wrapper.vm;

      expect(isFormInvalid).toBe(expected);
    });
  });

  describe('should correctly update form data after navigation to edit todo page', () => {
    const existingTodoItem = todos[0];
    const missingTodoId = uuidv4();

    it.each([
      [
        existingTodoItem.id,
        {
          description: existingTodoItem.description,
          priority: existingTodoItem.priority,
        },
      ],
      [
        missingTodoId,
        {
          description: '',
          priority: '',
        },
      ],
    ])('when navigating to edit todo form for todo with %p then form values should be %p', async (todoId, expected) => {
      const options = {
        mocks: {
          $route: {
            params: {
              id: todoId,
            },
          },
        },
      };
      const wrapper = createWrapper({ options });
      const { form } = wrapper.vm;

      expect(form).toEqual(expected);
    });
  });

  describe('form submission', () => {
    it('when form is submitted and computed isFormInvalid is false and anyFieldChanged is true then editTodo action should be called with expected arguments and navigation to home route should happen', async () => {
      const existingTodoItem = todos[0];
      const options = {
        computed: {
          isFormInvalid() {
            return false;
          },
          anyFieldChanged() {
            return true;
          },
        },
        mocks: {
          $route: {
            params: {
              id: existingTodoItem.id,
            },
          },
        },
      };
      const wrapper = createWrapper({ options });
      const form = wrapper.find('[data-test-id="form"]');
      const expectedShape = {
        id: existingTodoItem.id,
        description: expect.any(String),
        priority: expect.any(String),
      };
      await form.trigger('submit.prevent');

      expect(actions.editTodo).toHaveBeenCalledTimes(1);
      expect(actions.editTodo.mock.calls[0][1]).toMatchObject(expectedShape);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.$router.push.mock.calls[0][0]).toEqual({ name: 'Home' });
    });

    it('when form is submitted and computed isFormInvalid is false and anyFieldChanged is true and editTodo action failed then it should stay on the current route', async () => {
      const store = new Vuex.Store({
        state: {
          todos,
        },
        actions: {
          editTodo: jest.fn().mockRejectedValue(new Error()),
        },
        getters,
      });
      const options = {
        computed: {
          isFormInvalid() {
            return false;
          },
          anyFieldChanged() {
            return true;
          },
        },
      };
      const wrapper = createWrapper({ options, store });
      const form = wrapper.find('[data-test-id="form"]');
      await form.trigger('submit.prevent');

      expect(wrapper.vm.$router.push).not.toHaveBeenCalled();
    });
  });

  it.each([
    [true, true, 'disabled', 'disabled'],
    [true, false, 'disabled', 'disabled'],
    [false, true, 'enabled', undefined],
    [false, false, 'disabled', 'disabled'],
  ])('when %p and %p then edit todo button should be %p', (isFormInvalid, anyFieldChanged, buttonState, expected) => {
    const options = {
      computed: {
        isFormInvalid() {
          return isFormInvalid;
        },
        anyFieldChanged() {
          return anyFieldChanged;
        },
      },
    };
    const wrapper = createWrapper({ options });
    const editTodoButton = wrapper.find('[data-test-id="edit-todo-form"]');

    expect(editTodoButton.attributes('disabled')).toBe(expected);
  });

  it('when todo was not found by id in store state then input and select controls should be disabled', async () => {
    const missingTodoId = uuidv4();
    const options = {
      mocks: {
        $route: {
          params: {
            id: missingTodoId,
          },
        },
      },
    };
    const wrapper = createWrapper({ options });
    const input = wrapper.find('[data-test-id="input"]');
    const select = wrapper.find('[data-test-id="select"]');

    expect(input.vm.$attrs.disabled).toBe(true);
    expect(select.vm.$attrs.disabled).toBe(true);
  });

  it('when todo was found by id in store state', async () => {
    const existingTodoId = todos[0].id;
    const options = {
      mocks: {
        $route: {
          params: {
            id: existingTodoId,
          },
        },
      },
    };
    const wrapper = createWrapper({ options });
    const input = wrapper.find('[data-test-id="input"]');
    const select = wrapper.find('[data-test-id="select"]');

    expect(input.vm.$attrs.disabled).toBe(false);
    expect(select.vm.$attrs.disabled).toBe(false);
  });

  it('computed todoId should be equal current route params id', () => {
    const randomId = uuidv4();
    const options = {
      mocks: {
        $route: {
          params: {
            id: randomId,
          },
        },
      },
    };
    const wrapper = createWrapper({ options });
    const { todoId } = wrapper.vm;

    expect(todoId).toBe(randomId);
  });
});
