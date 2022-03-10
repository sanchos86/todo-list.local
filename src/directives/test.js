import Vue from 'vue';

const test = (el, binding) => {
  if (process.env.NODE_ENV === 'test') {
    Object.keys(binding.value).forEach((item) => el.setAttribute(`data-test-${item}`, binding.value[item]));
  }
};

Vue.directive('test', test);

export default test;
