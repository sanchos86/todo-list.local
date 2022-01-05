<template>
  <table class="table">
    <thead>
    <tr>
      <td v-for="item in headers" :key="item.value">{{ item.text }}</td>
    </tr>
    </thead>
    <tbody>
      <template v-if="items.length">
        <tr v-for="(item, rowIndex) in items" :key="rowIndex">
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
      <tr v-else>
        <td class="text-center" :colspan="colspan">{{ noDataText }}</td>
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
      default: () => ([]),
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

<style scoped>

</style>
