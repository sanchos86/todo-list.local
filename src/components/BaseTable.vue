<template>
  <table class="table">
    <thead>
    <tr v-test="{ id: 'thead-row' }">
      <th v-for="item in headers" :key="item.value">{{ item.text }}</th>
    </tr>
    </thead>
    <tbody v-test="{ id: 'tbody' }">
      <template v-if="items.length">
        <tr v-for="(item, rowIndex) in items" :key="rowIndex" v-test="{ id: 'data-row' }">
          <td v-for="(header, columnIndex) in headers" :key="header.value">
            <slot
                :name="`item.${header.value}`"
                :row-index="rowIndex"
                :column-index="columnIndex"
                :item="item"
            >
              {{ item[header.value] }}
            </slot>
          </td>
        </tr>
      </template>
      <tr v-else v-test="{ id: 'no-data-row' }">
        <td class="text-center" :colspan="colspan">
          {{ noDataText }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'BaseTable',

  props: {
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    noDataText: {
      type: String,
      default: 'No data available',
    },
  },

  computed: {
    colspan() {
      return this.headers.length;
    },
  },
};
</script>
