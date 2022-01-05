<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col">
          <todos-table />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodosTable from '@/components/TodosTable.vue';

export default {
  name: 'Home',

  components: {
    TodosTable,
  },
};
</script>
