import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue'; 
// import TaskProcessor from '../components/views/TaskProcessors.vue';

const routes = [
  {
    path: '/taskprocessor',
    name: 'TaskProcessor',
    component: defineAsyncComponent(() => import('../components/views/TaskProcessors.vue'))
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;