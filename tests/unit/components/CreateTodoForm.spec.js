import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuelidate from 'vuelidate';
import Vuex from 'vuex';

import CreateTodoForm from '@/components/CreateTodoForm.vue';
import test from '@/directives/test';
import priorities from '@/constants/priorities';

const actions = {
  addTodo: jest.fn().mockResolvedValue(null),
};
const $router = {
  push: jest.fn().mockResolvedValue(null),
};

const createWrapper = (extraOptions = {}) => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(Vuelidate);
  const store = new Vuex.Store({
    actions,
  });
  const defaultOptions = {
    localVue,
    store,
    directives: {
      test,
    },
    mocks: {
      $router,
    },
  };
  const options = { ...defaultOptions, ...extraOptions };
  return shallowMount(CreateTodoForm, options);
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('CreateTodoForm.vue', () => {
  it('when computed isFormInvalid is true then form submit button should be disabled', () => {
    const wrapper = createWrapper({
      computed: {
        isFormInvalid() {
          return true;
        },
      },
    });
    const submitButton = wrapper.find('[data-test-id="submit-button"]');

    expect(submitButton.attributes('disabled')).toBe('disabled');
  });

  it('when computed isFormInvalid is false then form submit button should not be disabled', () => {
    const wrapper = createWrapper({
      computed: {
        isFormInvalid() {
          return false;
        },
      },
    });
    const submitButton = wrapper.find('[data-test-id="submit-button"]');

    expect(submitButton.attributes('disabled')).toBeUndefined();
  });

  describe('form submission', () => {
    it('when form is submitted and computed isFormInvalid is true then expected store action should be called with expected arguments and navigation to home route should happen', async () => {
      const wrapper = createWrapper({
        computed: {
          isFormInvalid() {
            return false;
          },
        },
      });
      const form = wrapper.find('[data-test-id="form"]');
      const expectedShape = {
        id: expect.any(String),
        description: expect.any(String),
        priority: expect.any(String),
      };
      await form.trigger('submit.prevent');

      expect(actions.addTodo).toHaveBeenCalledTimes(1);
      expect(actions.addTodo.mock.calls[0][1]).toMatchObject(expectedShape);
      expect($router.push).toHaveBeenCalledTimes(1);
      expect($router.push.mock.calls[0][0]).toEqual({ name: 'Home' });
    });

    it('when form is submitted and computed isFormInvalid is true and expected store action failed then it should stay on the current route', async () => {
      // eslint-disable-next-line no-shadow
      const $router = {
        push: jest.fn().mockResolvedValue(null),
      };
      const store = new Vuex.Store({
        actions: {
          addTodo: jest.fn().mockRejectedValue(new Error()),
        },
      });
      const extraOptions = {
        store,
        mocks: {
          $router,
        },
        computed: {
          isFormInvalid() {
            return false;
          },
        },
      };
      const wrapper = createWrapper(extraOptions);
      const form = wrapper.find('[data-test-id="form"]');
      await form.trigger('submit.prevent');

      expect($router.push).not.toHaveBeenCalled();
    });

    it.todo('when form is submitted and computed isFormInvalid is false then $touch method of vuelidate should be called');
  });

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
});
