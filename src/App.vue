<template>
  <div id="app">
    <the-nav class="mb-4" />
    <main>
      <transition name="slide-in" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
import TheNav from '@/components/TheNav.vue';

export default {
  components: {
    TheNav,
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
