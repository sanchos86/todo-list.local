<template>
  <div class="position-relative">
    <label v-if="hasLabel" :for="normalizedId" class="form-label">
      {{ $slots.default || label }}
    </label>
    <select
        class="form-control"
        v-bind="$attrs"
        :id="normalizedId"
        :class="{ 'is-invalid': invalid }"
        :value="value"
        @change="$emit('input', $event.target.value)"
    >
      <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div v-if="showError" class="invalid-tooltip">{{ error }}</div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'BaseSelect',

  inheritAttrs: false,

  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
    },
    id: {
      type: String,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
    },
    options: {
      type: Array,
      required: true,
    },
  },

  computed: {
    hasLabel() {
      return Boolean(this.$slots.default || this.label);
    },
    normalizedId() {
      return this.id ?? `id-${uuidv4()}`;
    },
    showError() {
      return this.invalid && Boolean(this.error);
    },
  },
};
</script>
