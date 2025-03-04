<script>
import axios from 'axios';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout } from '@mdi/js';

import InProcessOrderList from '../../components/orders/InProcessOrderList.vue';
import FinishedOrderList from '../../components/orders/FinishedOrderList.vue';
import ServedOrderList from '../../components/orders/ServedOrderList.vue';
import NewOrder from '../../components/orders/NewOrder.vue';
import Popup from '../../components/popup/Popup.vue';

export default {
  components: {
    InProcessOrderList,
    FinishedOrderList,
    ServedOrderList,
    NewOrder,
    Popup,
    SvgIcon
  },
  data() {
    return {
      currentComponent: "NewOrder",
      isMobileMenuOpen: false,
      isMobile: false,
      popupMessage: null,
      popupType: null,
      popupVisible: false,
      iconPath: mdiLogout,
    }
  },
  async mounted() {
    try {
      await this.redirectHandler();
    } catch (error) {
      this.triggerPopup("Hiba történt a betöltés során!", "error")
    }

    this.isMobile = window.innerWidth <= 1100;
    window.addEventListener("resize", this.updateIsMobile);
  },
  methods: {
    async redirectHandler() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/redirect`, {
          params: { page: "orders" },
          withCredentials: true
        });

        if (response.data.isAuthorized !== true) {
          if (response.data.message == "Invalid Role") this.$router.push({ name: 'Home' });
          else this.$router.push({ name: 'Login' });
        }
      } catch (error) {
        this.triggerPopup("Hiba történt a betöltés során!", "error");
        return false
      }
    },
    async logout() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT} /logout`, null, {
          withCredentials: true
        });

        if (response.status === 200) this.$router.push({ name: 'Login' });
        this.triggerPopup("Hiba történt a kijelentkezés során!", "error");
      } catch (error) {
        this.triggerPopup("Hiba történt a kijelentkezés során!", "error");
      }
    },
    triggerPopup(message, type) {
      this.popupMessage = message;
      this.popupType = type;
      this.popupVisible = true;

      setTimeout(() => {
        this.popupVisible = false;
      }, 3000);
    },
    updateIsMobile() {
      this.isMobile = window.innerWidth <= 1100;
    }
  },
}

</script>

<template>
  <div class="home-bg">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <button class="hamburger-menu" @click="isMobileMenuOpen = !isMobileMenuOpen">&#9776;</button>

          <RouterLink v-if="!isMobileMenuOpen && !isMobile" to="/">
            <button class="navbar-link">Back</button>
          </RouterLink>
        </div>

        <div v-if="!isMobileMenuOpen" class="navbar-center">
          <button @click="currentComponent = 'NewOrder'" class="navbar-link">Új rendelés</button>
          <button @click="currentComponent = 'InProcessOrderList'" class="navbar-link">Készülő rendelések lista</button>
          <button @click="currentComponent = 'FinishedOrderList'" class="navbar-link">Elkészült rendelések
            lista</button>
          <button @click="currentComponent = 'ServedOrderList'" class="navbar-link">Felszolgált rendelések
            lista</button>
        </div>

        <div class="navbar-right">
          <button @click="logout" class="logout-button">
            Kijelentkezés
            <svg-icon type="mdi" :path="iconPath" />
          </button>
        </div>
      </div>

      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <RouterLink to="/" @click="isMobileMenuOpen = false">
          <button class="navbar-link">Back</button>
        </RouterLink>
        <button @click="currentComponent = 'NewOrder'" class="navbar-link">Új rendelés</button>
        <button @click="currentComponent = 'InProcessOrderList'" class="navbar-link">Készülő rendelések lista</button>
        <button @click="currentComponent = 'FinishedOrderList'" class="navbar-link">Elkészült rendelések lista</button>
        <button @click="currentComponent = 'ServedOrderList'" class="navbar-link">Felszolgált rendelések lista</button>
      </div>
    </nav>

    <div class="content-body">
      <component :is="currentComponent"></component>
    </div>
  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />

</template>

<style scoped></style>
