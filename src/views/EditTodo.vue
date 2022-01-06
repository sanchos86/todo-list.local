<template>
  <div class="edit-todo">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Edit todo</h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <edit-todo-form />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditTodoForm from '@/components/EditTodoForm.vue';

export default {
  name: 'EditTodo',

  components: {
    EditTodoForm,
  },
};
</script>
