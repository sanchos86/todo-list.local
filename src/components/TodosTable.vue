<template>
  <base-table :headers="headers" :items="todos">
    <template v-slot:item.number="{ rowIndex }">
      <span v-test="{ id: 'number' }">{{ rowIndex + 1 }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <span class="d-flex align-items-center" v-test="{ id: 'actions' }">
        <router-link
            class="btn btn-sm btn-primary me-2 flex-shrink-0"
            :to="{ name: 'EditTodo', params: { id: item.id } }"
        >
          Edit todo
        </router-link>
        <button
            v-test="{ id: 'delete-todo-button' }"
            class="btn btn-sm btn-danger flex-shrink-0"
            @click="deleteTodo(item.id)"
        >
          Delete todo
        </button>
      </span>
    </template>
  </base-table>
</template>

<script>
import { mapState } from 'vuex';

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
    };
  },

  computed: {
    ...mapState(['todos']),
  },

  methods: {
    deleteTodo(id) {
      this.$store.dispatch('deleteTodo', id);
    },
  },
};
</script>
