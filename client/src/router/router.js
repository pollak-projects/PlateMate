import { createRouter, createWebHistory } from 'vue-router'
import Reservation from '../pages/reservations/Reservations.vue'
import NotFound from '../pages/404/NotFound.vue'
import Home from '../pages/landing/Home.vue'
import Cashout from '../pages/cashout/Cashout.vue'
import PaidOrders from '../pages/admin/PaidOrders.vue'
import OpeningHours from '../pages/admin/OpeningHours.vue'
import Orders from '../pages/orders/Orders.vue'
import Users from "../pages/admin/Users.vue";
import Tables from "../pages/admin/Tables.vue";
import Login from "../pages/auth/Login.vue";
import Sections from '../pages/admin/Sections.vue'
import Items from '../pages/admin/Items.vue'
import Categories from '../pages/admin/Categories.vue'
import PaymentMethods from '../pages/admin/PaymentMethods.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/reservations', name: 'Reservations', component: Reservation },
  { path: '/cashout', name: 'Cashout', component: Cashout },
  { path: '/paid-orders', name: 'PaidOrders', component: PaidOrders },
  { path: '/opening-hours', name: 'OpeningHours', component: OpeningHours },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/users', name: 'Users', component: Users },
  { path: '/tables', name: 'Tables', component: Tables },
  { path: '/login', name: 'Login', component: Login },
  { path: '/items', name: 'Items', component: Items },
  { path: '/categories', name: 'Categories', component: Categories },
  { path: '/sections', name: 'Sections', component: Sections },
  { path: '/payment-methods', name: 'PaymentMethods', component: PaymentMethods },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
