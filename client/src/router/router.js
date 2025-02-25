import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '../pages/404/NotFound.vue'


const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router