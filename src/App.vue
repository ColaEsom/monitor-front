<template>
  <!-- <LoginView msg="Welcome to Your Vue.js App"/> -->
   <!-- 声明路由的占位符 -->
   <router-view></router-view>
</template>

<script>
// import LoginView from './components/views/LoginView.vue';

export default {
  name: 'App',
  components: {
    // LoginView
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
