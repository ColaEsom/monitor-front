
import LoginView from '../components/views/LoginView.vue';
import IndexView from '../components/views/IndexView.vue';
import TaskProcessors from '../components/views/TaskProcessors.vue';

const routes = [
  {
    path: '/',
    component: LoginView,
    beforeEnter(to, from, next) {
      // 如果用户已经登录，直接跳转到 IndexView 页面
      const isLoggedIn = false; // 假设用户未登录
      if (isLoggedIn) {
        next('/index');
      } else {
        next();
      }
    }
  },
  {
    path: '/index',
    name: 'indexView',
    component: IndexView
  },
  {
    path: '/task-processors',
    name: 'taskProcessors',
    component: TaskProcessors
  }
];

export default routes;