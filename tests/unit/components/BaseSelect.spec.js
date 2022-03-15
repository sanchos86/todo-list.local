import { mount, createLocalVue } from '@vue/test-utils';

import BaseSelect from '@/components/BaseSelect.vue';
import test from '@/directives/test';
import priorities from '@/constants/priorities';

const createWrapper = (propsData) => {
  const localVue = createLocalVue();
  const normalizedPopsData = propsData ? {
    value: '',
    options: priorities.options,
    ...propsData,
  } : {
    value: '',
    options: priorities.options,
  };

  return mount(BaseSelect, {
    directives: {
      test,
    },
    propsData: normalizedPopsData,
    localVue,
  });
};

describe('BaseSelect.vue', () => {
  it('should emit input event when user select any option', () => {
    const wrapper = createWrapper();
    const select = wrapper.find('[data-test-id="select"]');
    const { value } = priorities.low;
    select.element.value = value;
    select.trigger('change');

    expect(wrapper.emitted('input')).toHaveLength(1);
    expect(wrapper.emitted('input')[0][0]).toBe(value);
  });

  it('should add "is-invalid" class on select if invalid property is true', () => {
    const wrapper = createWrapper({ invalid: true });
    const select = wrapper.find('[data-test-id="select"]');

    expect(select.classes()).toContain('is-invalid');
  });

  it('should render error message if both invalid property is true and error property exists', () => {
    const errorMessage = 'Fake error message';
    const wrapper = createWrapper({ invalid: true, error: errorMessage });
    const errorMessageWrapper = wrapper.find('[data-test-id="error-message"]');

    expect(errorMessageWrapper.exists()).toBe(true);
    expect(errorMessageWrapper.text()).toBe(errorMessage);
  });

  it('should render label if default slot or label property exist', () => {
    const labelSelector = '[data-test-id="label"]';
    const fakeLabel = 'Fake label';
    const defaultSlot = {
      render(h) {
        return h('span', 'Default slot');
      },
    };
    const localVue = createLocalVue();
    let wrapper = createWrapper();
    let labelWrapper = wrapper.find(labelSelector);
    expect(labelWrapper.exists()).toBe(false);

    wrapper = createWrapper({ label: fakeLabel });
    labelWrapper = wrapper.find(labelSelector);
    expect(labelWrapper.exists()).toBe(true);
    expect(labelWrapper.text()).toBe(fakeLabel);

    wrapper = mount(BaseSelect, {
      localVue,
      directives: {
        test,
      },
      propsData: {
        value: priorities.high.value,
        options: priorities.options,
      },
      slots: {
        default: defaultSlot,
      },
    });
    labelWrapper = wrapper.find(labelSelector);
    expect(labelWrapper.exists()).toBe(true);
    expect(labelWrapper.findComponent(defaultSlot).exists()).toBe(true);
  });

  it('should render options count equal to options prop length', () => {
    const wrapper = createWrapper();
    const optionsLength = priorities.options.length;
    const options = wrapper.findAll('[data-test-id="option"]');

    expect(options.length).toBe(optionsLength);
  });
});
