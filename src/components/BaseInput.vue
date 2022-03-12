<template>
  <div class="position-relative">
    <label v-if="hasLabel" :for="normalizedId" class="form-label" v-test="{ id: 'label' }">
      <slot>{{ label }}</slot>
    </label>
    <input
        v-test="{ id: 'input' }"
        type="text"
        class="form-control"
        v-bind="$attrs"
        :value="value"
        :id="normalizedId"
        :class="{ 'is-invalid': invalid }"
        @input="$emit('input', $event.target.value)"
    >
    <div v-if="showError" class="invalid-tooltip" v-test="{ id: 'error-message' }">{{ error }}</div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'BaseInput',

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
