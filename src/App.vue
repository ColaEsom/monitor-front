<template>
  <IndexView msg="Welcome to Your Vue.js App"/>
  <!-- <TaskProcessors msg="Welcome to Your Vue.js App"/> -->
</template>

<script>
import IndexView from './components/views/IndexView.vue';
// import TaskProcessors from './components/views/TaskProcessors.vue';

export default {
  name: 'App',
  components: {
    IndexView
    // TaskProcessors
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
