import { mount, createLocalVue } from '@vue/test-utils';

import BaseTable from '@/components/BaseTable.vue';
import test from '@/directives/test';
import priorities from '@/constants/priorities';

const headers = [
  { value: 'number', text: 'One' },
  { value: 'description', text: 'Two' },
  { value: 'priority', text: 'Three' },
];

const createWrapper = (items) => {
  const localVue = createLocalVue();
  return mount(BaseTable, {
    localVue,
    propsData: {
      items,
      headers,
    },
    directives: { test },
  });
};

const createItems = (itemsLength) => Array.from({ length: itemsLength }).map((_, index) => ({
  number: index + 1,
  priority: priorities.low,
  description: `Description #${index}`,
}));

describe('BaseTable.vue', () => {
  it('should render one table row and noDataText prop in this row if items length is 0', () => {
    const wrapper = createWrapper([]);
    const tbody = wrapper.find('[data-test-id="tbody"]');
    const noDataRow = wrapper.find('[data-test-id="no-data-row"]');

    expect(tbody.findAll('tr')).toHaveLength(1);
    expect(noDataRow.exists()).toBe(true);
    expect(noDataRow.text()).toBe(wrapper.props('noDataText'));
  });

  it('colspan for no data row should be equal length of headers prop', () => {
    const localThis = { headers };

    expect(BaseTable.computed.colspan.call(localThis)).toBe(headers.length);
  });

  it('should correctly render table header', () => {
    const wrapper = createWrapper([]);
    const theadRow = wrapper.find('[data-test-id="thead-row"]');
    const theadRowCells = theadRow.findAll('th');

    expect(theadRowCells).toHaveLength(headers.length);
    headers.forEach((el, index) => {
      expect(theadRowCells.at(index).text()).toBe(el.text);
    });
  });

  it('should render correct count of data rows: count should be equal to items prop length', () => {
    const itemsLength = 5;
    const items = createItems(itemsLength);
    const wrapper = createWrapper(items);
    const tbody = wrapper.find('[data-test-id="tbody"]');
    const noDataRow = wrapper.find('[data-test-id="no-data-row"]');
    const tbodyRows = tbody.findAll('tr');

    expect(noDataRow.exists()).toBe(false);
    expect(tbodyRows).toHaveLength(itemsLength);
  });

  it('should render data from items prop in data cell if no slot with name "items.[header.value]" passed', () => {
    const itemsLength = 3;
    const items = createItems(itemsLength);
    const wrapper = createWrapper(items);
    const tbody = wrapper.find('[data-test-id="tbody"]');
    const tbodyRows = tbody.findAll('tr');
    const headerIndex = 0;
    const header = headers[headerIndex];

    items.forEach((el, index) => {
      const tbodyRow = tbodyRows.at(index);
      const tbodyRowCells = tbodyRow.findAll('td');
      const tbodyCellAtHeaderIndex = tbodyRowCells.at(headerIndex);

      expect(tbodyCellAtHeaderIndex.text()).toBe(String(el[header.value]));
    });
  });

  it('should render scoped slot in correct place and pass correct props to its slot', () => {
    const itemsLength = 3;
    const items = createItems(itemsLength);
    const localVue = createLocalVue();
    const headerIndex = 0;
    const header = headers[headerIndex];
    const expectedItemPropShape = Object.keys(items[0]).reduce((acc, currValue) => {
      acc[currValue] = expect.anything();
      return acc;
    }, {});
    const fakeSlotComponent = {
      render(h) {
        return h('span', 'fake slot');
      },
    };

    const wrapper = mount(BaseTable, {
      localVue,
      propsData: {
        items,
        headers,
      },
      directives: { test },
      scopedSlots: {
        [`item.${header.value}`](props) {
          expect(props).toHaveProperty('rowIndex');
          expect(props).toHaveProperty('columnIndex');
          expect(props?.item).toMatchObject(expectedItemPropShape);
          return this.$createElement(fakeSlotComponent);
        },
      },
    });
    const tbody = wrapper.find('[data-test-id="tbody"]');
    const tbodyRows = tbody.findAll('tr');
    items.forEach((el, index) => {
      const tbodyRow = tbodyRows.at(index);
      const tbodyRowCells = tbodyRow.findAll('td');
      const tbodyCellAtHeaderIndex = tbodyRowCells.at(headerIndex);
      expect(tbodyCellAtHeaderIndex.findComponent(fakeSlotComponent).exists()).toBe(true);
    });
  });
});
