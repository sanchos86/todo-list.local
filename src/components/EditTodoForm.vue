<template>
  <form @submit.prevent="editTodo" v-test="{ id: 'form' }">
    <base-input
      v-model="$v.form.description.$model"
      label="Description:"
      class="mb-3"
      :invalid="$v.form.description.$error"
      :error="$getErrorMessage($v.form.description)"
      :disabled="!todo"
      v-test="{ id: 'input' }"
    />
    <base-select
      v-model="$v.form.priority.$model"
      label="Priority:"
      class="mb-3"
      :options="options"
      :invalid="$v.form.priority.$error"
      :error="$getErrorMessage($v.form.priority)"
      :disabled="!todo"
      v-test="{ id: 'select' }"
    />
    <div class="text-end">
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isFormInvalid || !anyFieldChanged"
        v-test="{ id: 'edit-todo-form' }"
      >
        Edit todo
      </button>
    </div>
  </form>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';

import priorities from '@/constants/priorities';
import ValidationMixin from '@/mixins/ValidationMixin';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';

export default {
  name: 'EditTodoForm',

  components: {
    BaseInput,
    BaseSelect,
  },

  mixins: [ValidationMixin],

  data() {
    return {
      form: {
        description: '',
        priority: '',
      },
      options: priorities.options,
      todo: null,
    };
  },

  validations: {
    form: {
      description: {
        required,
        minLength: minLength(6),
      },
      priority: {
        required,
      },
    },
  },

  computed: {
    isFormInvalid() {
      return this.$v.form.$invalid;
    },
    todoId() {
      return this.$route.params.id;
    },
    anyFieldChanged() {
      const { todo, form } = this;
      if (!todo) {
        return false;
      }
      return todo.description !== form.description || todo.priority !== form.priority;
    },
  },

  created() {
    const todo = this.$store.getters.getTodoById(this.todoId);
    if (todo) {
      this.todo = todo;
      this.updateForm(todo);
    }
  },

  methods: {
    async editTodo() {
      try {
        const {
          isFormInvalid,
          anyFieldChanged,
          form,
          todoId,
        } = this;
        if (!isFormInvalid && anyFieldChanged) {
          const todo = {
            id: todoId,
            description: form.description,
            priority: form.priority,
          };
          await this.$store.dispatch('editTodo', todo);
          await this.$router.push({ name: 'Home' });
        } else {
          this.$v.form.$touch();
        }
      } catch (e) {
      }
    },
    updateForm(todo) {
      this.form.description = todo.description;
      this.form.priority = todo.priority;
    },
  },
};
</script>
