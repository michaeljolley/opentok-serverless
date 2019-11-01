<template>
  <div>
    <nav class="nav">
      <router-link class="nav-link" :to="{ name: 'Home'}">Taco-bout-it</router-link>
    </nav>
    <div id="app" class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style >
</style>
