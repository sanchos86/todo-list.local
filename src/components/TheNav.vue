<template>
  <nav class="navbar navbar-expand navbar-dark bg-primary">
    <div class="container-fluid">
      <span
        v-if="$route.name === 'Home'"
        v-test="{ id: 'logo' }"
        class="navbar-brand"
      >
        TodoList
      </span>
      <router-link
        v-else
        class="navbar-brand"
        v-test="{ id: 'logo' }"
        :to="{ name: 'Home' }"
      >
        TodoList
      </router-link>
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link
            v-test="{ id: 'home-page-link' }"
            :to="{ name: 'Home' }"
            class="nav-link"
            exact
          >
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-test="{ id: 'create-todo-page-link' }"
            :to="{ name: 'CreateTodo' }"
            class="nav-link"
          >
            Create todo
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
