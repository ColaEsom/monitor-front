import { createRouter, createWebHistory } from 'vue-router';
import TaskProcessor from '../components/views/TaskProcessors.vue';

const routes = [
  {
    path: '/taskprocessor',
    name: 'TaskProcessor',
    component: TaskProcessor
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;