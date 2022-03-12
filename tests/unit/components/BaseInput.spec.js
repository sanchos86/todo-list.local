import { mount, createLocalVue } from '@vue/test-utils';

import BaseInput from '@/components/BaseInput.vue';
import test from '@/directives/test';

const createWrapper = (propsData) => {
  const localVue = createLocalVue();
  return mount(BaseInput, {
    localVue,
    directives: { test },
    propsData: propsData ? { value: 'BaseInput', ...propsData } : { value: 'BaseInput' },
  });
};

describe('BaseInput.vue', () => {
  it('should emit input event when user enter text in input field', () => {
    const wrapper = createWrapper();
    const input = wrapper.find('[data-test-id="input"]');
    const text = 'Hello, world';
    input.element.value = text;
    input.trigger('input');

    expect(wrapper.emitted('input')).toHaveLength(1);
    expect(wrapper.emitted('input')[0][0]).toBe(text);
  });

  it('should add "is-invalid" class on input if invalid property is true', () => {
    const wrapper = createWrapper({ invalid: true });
    const input = wrapper.find('[data-test-id="input"]');

    expect(input.classes()).toContain('is-invalid');
  });

  it('should render error message if invalid property is true and error property exists', () => {
    const errorMessage = 'Error message';
    const wrapper = createWrapper({ invalid: true, error: errorMessage });
    const errorMessageWrapper = wrapper.find('[data-test-id="error-message"]');

    expect(errorMessageWrapper.exists()).toBe(true);
    expect(errorMessageWrapper.text()).toBe(errorMessage);
  });

  it('should render label if default slot or label property exists', () => {
    const label = 'Fake label';
    const defaultSlot = {
      render(h) {
        return h('span', 'Default slot');
      },
    };
    const localVue = createLocalVue();
    let wrapper = createWrapper();
    let labelWrapper = wrapper.find('[data-test-id="label"]');
    expect(labelWrapper.exists()).toBe(false);

    wrapper = createWrapper({ label });
    labelWrapper = wrapper.find('[data-test-id="label"]');
    expect(labelWrapper.exists()).toBe(true);

    wrapper = mount(BaseInput, {
      localVue,
      directives: { test },
      propsData: { value: 'BaseInput' },
      slots: { default: defaultSlot },
    });
    labelWrapper = wrapper.find('[data-test-id="label"]');
    expect(labelWrapper.exists()).toBe(true);
  });

  it('should render default slot inside label tag if both default slot and label property exists', () => {
    const label = 'Fake label';
    const defaultSlot = {
      render(h) {
        return h('span', 'Default slot');
      },
    };
    const localVue = createLocalVue();
    const wrapper = mount(BaseInput, {
      localVue,
      directives: { test },
      propsData: { value: 'BaseInput', label },
      slots: { default: defaultSlot },
    });
    const labelWrapper = wrapper.find('[data-test-id="label"]');

    expect(labelWrapper.findComponent(defaultSlot).exists()).toBe(true);
    expect(labelWrapper.text()).not.toContain(label);
  });
});
