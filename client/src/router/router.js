import { createRouter, createWebHistory } from 'vue-router'
import Reservation from '../pages/reservations/Reservations.vue'
import NotFound from '../pages/404/NotFound.vue'
import Home from '../pages/landing/Home.vue'
import Cashout from '../pages/cashout/Cashout.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/reservations', name: 'Reservations', component: Reservation },
  { path: '/cashout', name: 'Cashout', component: Cashout },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
