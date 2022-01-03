<template>
  <div id="app">
    <base-nav />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import BaseNav from '@/components/BaseNav.vue';

export default {
  components: {
    BaseNav,
  },
};
</script>
