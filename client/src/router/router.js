import { createRouter, createWebHistory } from 'vue-router'
import Reservation from '../pages/reservations/Reservations.vue'
import NotFound from '../pages/404/NotFound.vue'
import Home from '../pages/landing/Home.vue'
import Cashout from '../pages/cashout/Cashout.vue'
import PaidOrders from '../pages/admin/PaidOrders.vue'
import OpeningHours from '../pages/admin/OpeningHours.vue'
import Orders from '../pages/orders/Orders.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/reservations', name: 'Reservations', component: Reservation },
  { path: '/cashout', name: 'Cashout', component: Cashout },
  { path: '/paid-orders', name: 'PaidOrders', component: PaidOrders },
  { path: '/opening-hours', name: 'OpeningHours', component: OpeningHours },
  { path: '/orders', name: 'Orders', component: Orders },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
