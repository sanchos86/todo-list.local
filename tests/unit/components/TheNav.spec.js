import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

import TheNav from '@/components/TheNav.vue';
import { routes } from '@/router';
import test from '@/directives/test';

const homePageRoute = { name: 'Home' };
const homePageRouteText = 'Home';
const createTodoPageRoute = { name: 'CreateTodo' };
const createTodoPageRouteText = 'Create todo';

let wrapper;
let router;

beforeAll(() => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  router = new VueRouter({
    mode: 'history',
    routes,
  });
  wrapper = mount(TheNav, {
    localVue,
    router,
    directives: { test },
  });
});

describe('TheNav.vue', () => {
  it('should always contain router link to home page', () => {
    const homePageLink = wrapper.find('[data-test-id="home-page-link"]');

    expect(homePageLink.exists()).toBe(true);
    expect(homePageLink.is({ name: 'RouterLink' })).toBe(true);
    expect(homePageLink.props('to')).toEqual(homePageRoute);
    expect(homePageLink.text()).toBe(homePageRouteText);
  });

  it('should always contain router link to create todo page', () => {
    const createTodoPageLink = wrapper.find('[data-test-id="create-todo-page-link"]');

    expect(createTodoPageLink.exists()).toBe(true);
    expect(createTodoPageLink.is({ name: 'RouterLink' })).toBe(true);
    expect(createTodoPageLink.props('to')).toEqual(createTodoPageRoute);
    expect(createTodoPageLink.text()).toBe(createTodoPageRouteText);
  });

  it('should render span tag for logo on home page', () => {
    const expectedTagName = 'SPAN';
    const logoElement = wrapper.find('[data-test-id="logo"]');

    expect(logoElement.element.tagName).toBe(expectedTagName);
  });

  it('should render router link for logo on page different from home', async () => {
    await router.push(createTodoPageRoute);
    const logoElement = wrapper.find('[data-test-id="logo"]');

    expect(logoElement.is({ name: 'RouterLink' })).toBe(true);
    expect(logoElement.props('to')).toEqual(homePageRoute);
  });

  it('should render correct text for logo element', () => {
    const expectedText = 'TodoList';
    const logoElement = wrapper.find('[data-test-id="logo"]');

    expect(logoElement.text()).toBe(expectedText);
  });
});
