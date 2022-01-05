<template>
  <div id="app">
    <base-nav class="mb-4" />
    <main>
      <transition name="slide-in" mode="out-in">
        <router-view />
      </transition>
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

<style>
.slide-in-enter,
.slide-in-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: opacity .25s, transform .25s;
}
</style>
