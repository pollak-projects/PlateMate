<script>
import axios from 'axios';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout } from '@mdi/js';

import OpeningHourAdd from '../../components/admin/openingHours/OpeningHourAdd.vue';
import OpeningHourList from '../../components/admin/openingHours/OpeningHourList.vue';
import Popup from '../../components/popup/Popup.vue';

export default {
  components: {
    OpeningHourAdd,
    OpeningHourList,
    Popup,
    SvgIcon
  },
  data() {
    return {
      currentComponent: "OpeningHourAdd",
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
          params: { page: "admin" },
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
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/logout`, null, {
          withCredentials: true
        });

        if (response.status === 200) this.$router.push({ name: 'Login' });
        else this.triggerPopup("Hiba történt a kijelentkezés során!", "error");
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
          <button @click="currentComponent = 'OpeningHourAdd'" class="navbar-link">Új nyitvatartás</button>
          <button @click="currentComponent = 'OpeningHourList'" class="navbar-link">Nyitvatartások lista</button>
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
        <button @click="currentComponent = 'OpeningHourAdd'" class="navbar-link">Új nyitvatartás</button>
        <button @click="currentComponent = 'OpeningHourList'" class="navbar-link">Nyitvatartások lista</button>
      </div>
    </nav>

    <div class="content-body">
      <component :is="currentComponent"></component>
    </div>
  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />

</template>


<style scoped></style>