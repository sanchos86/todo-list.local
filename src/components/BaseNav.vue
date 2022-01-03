<template>
  <nav class="navbar navbar-expand navbar-dark bg-primary">
    <div class="container-fluid">
      <span v-if="$route.name === 'Home'" class="navbar-brand">TodoList</span>
      <router-link v-else class="navbar-brand" :to="{ name: 'Home' }">TodoList</router-link>
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link :to="{ name: 'Home' }" class="nav-link" exact>Home</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'CreateTodo' }" class="nav-link">Create todo</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
