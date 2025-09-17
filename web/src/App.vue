<template>
  <div id="app">
    <CreateTicketForm />
  </div>
</template>

<script setup lang="ts">
import CreateTicketForm from './components/CreateTicketForm.vue'
</script>

<style>
#app {
  min-height: 100vh;
  background: #f3f4f6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>