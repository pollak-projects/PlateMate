import { createApp } from 'vue'
import './style.css'
import router from './router/router.js'
import App from './App.vue'
import VueCookies from 'vue-cookies';

createApp(App).use(VueCookies).use(router).mount('#app')