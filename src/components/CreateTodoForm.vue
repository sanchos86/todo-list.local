<template>
  <form @submit.prevent="addTodo">
    <base-input
        v-model="$v.form.description.$model"
        class="mb-3"
        label="Description:"
        :invalid="$v.form.description.$error"
        :error="$getErrorMessage($v.form.description)"
    />
    <base-select
        v-model="$v.form.priority.$model"
        class="mb-3"
        :options="options"
        label="Priority:"
        :invalid="$v.form.priority.$error"
        :error="$getErrorMessage($v.form.priority)"
    />
    <div class="text-end">
      <button type="submit" class="btn btn-primary" :disabled="isFormInvalid">Add todo</button>
    </div>
  </form>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { required, minLength } from 'vuelidate/lib/validators';

import priorities from '@/constants/priorities';
import ValidationMixin from '@/mixins/ValidationMixin';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';

export default {
  name: 'CreateTodoForm',

  components: {
    BaseSelect,
    BaseInput,
  },

  mixins: [ValidationMixin],

  data() {
    return {
      form: {
        description: '',
        priority: '',
      },
      options: priorities.options,
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
  },

  methods: {
    async addTodo() {
      const { isFormInvalid, form } = this;
      if (!isFormInvalid) {
        const todo = {
          id: uuidv4(),
          description: form.description,
          priority: form.priority,
        };
        await this.$store.dispatch('addTodo', todo);
        await this.$router.push({ name: 'Home' });
      } else {
        this.$v.form.$touch();
      }
    },
  },
};
</script>
