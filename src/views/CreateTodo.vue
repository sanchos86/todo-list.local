<template>
  <div class="create-todo">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>Create todo</h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <create-todo-form />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateTodoForm from '@/components/CreateTodoForm.vue';

export default {
  name: 'CreateTodo',

  components: {
    CreateTodoForm,
  },
};
</script>
