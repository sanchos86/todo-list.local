<template>
  <base-table :headers="headers" :items="items">
    <template v-slot:item.number="{ rowIndex }">{{ rowIndex + 1 }}</template>
    <template v-slot:item.actions="{ item }">
      <span class="d-flex align-items-center">
        <button class="btn btn-sm btn-primary me-2" @click="editTodo(item)">Edit todo</button>
        <button class="btn btn-sm btn-danger" @click="deleteTodo(item)">Delete todo</button>
      </span>
    </template>
  </base-table>
</template>

<script>
import BaseTable from '@/components/BaseTable.vue';

export default {
  name: 'TodosTable',

  components: {
    BaseTable,
  },

  data() {
    return {
      headers: [
        { text: '#', value: 'number' },
        { text: 'Description', value: 'description' },
        { text: 'Priority', value: 'priority' },
        { text: 'Actions', value: 'actions' },
      ],
      items: [],
    };
  },

  methods: {
    editTodo(item) {
      console.log(item);
    },
    deleteTodo(item) {
      console.log(item);
    },
  },
};
</script>
