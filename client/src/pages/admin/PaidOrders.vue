<script>
import axios from 'axios';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout } from '@mdi/js';

import PaidOrderList from '../../components/admin/paidOrders/PaidOrderList.vue';
import Popup from '../../components/popup/Popup.vue';

export default {
  components: {
    PaidOrderList,
    Popup,
    SvgIcon
  },
  data() {
    return {
      currentComponent: "PaidOrderList",
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
    }
  },
}

</script>

<template>
  <div class="home-bg">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <RouterLink to="/">
            <button class="navbar-link">Back</button>
          </RouterLink>
        </div>

        <div class="navbar-right">
          <button @click="logout" class="logout-button">
            Kijelentkezés
            <svg-icon type="mdi" :path="iconPath" />
          </button>
        </div>
      </div>
    </nav>

    <div class="content-body">
      <component :is="currentComponent"></component>
    </div>
  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />

</template>

<style scoped></style>
