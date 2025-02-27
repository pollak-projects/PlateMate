<script>
import axios from 'axios';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout } from '@mdi/js';

import MenuDropdown from "../../components/landing/MenuDropdown.vue";
import Popup from '../../components/popup/Popup.vue';

export default {
  components: {
    Popup,
    MenuDropdown,
    SvgIcon
  },
  data() {
    return {
      openMenu: null,
      isAdminVisible: false,
      isReservationsVisible: false,
      isOrdersVisible: false,
      isCashoutVisible: false,
      isMobileMenuOpen: false,
      popupMessage: "",
      popupType: "",
      popupVisible: false,
      iconPath: mdiLogout,
    };
  },
  async mounted() {
    try {
      const response = await this.redirectHandler();

      if (response != false) {
        switch (response.role) {
          case 'admin':
            this.isAdminVisible = true;
            this.isOrdersVisible = true;
            this.isReservationsVisible = true;
            this.isCashoutVisible = true;
            break;
          case 'cashier':
            this.isCashoutVisible = true;
            break;
          case 'chef':
            this.isOrdersVisible = true;
            break;
          case 'waiter':
            this.isOrdersVisible = true;
            this.isReservationsVisible = true;
            break;
          default:
            break;
        }
      }
    } catch (error) {
      this.triggerPopup("Hiba történt a jogok ellenőrzése során!", "error")
    }
  },
  methods: {
    async redirectHandler() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/redirect`, {
          params: { page: "home" },
          withCredentials: true
        });

        if (response.data.isAuthorized != true) this.$router.push({ name: 'Login' });
        else return response.data;
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
    toggleMenu(menuName) {
      this.openMenu = this.openMenu === menuName ? null : menuName;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    triggerPopup(message, type) {
      this.popupMessage = message;
      this.popupType = type;
      this.popupVisible = true;

      setTimeout(() => {
        this.popupVisible = false;
      }, 3000);
    },
  }
};
</script>

<template>
  <div class="home-bg">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          <button class="hamburger-menu" @click="toggleMobileMenu">&#9776;</button>
          <div v-if="isMobileMenuOpen" class="mobile-menu">
            <MenuDropdown v-if="isAdminVisible" title="Admin Panel" :items="[
              { name: 'Termékek', path: '/items' },
              { name: 'Kategóriák', path: '/categories' },
              { name: 'Asztalok', path: '/tables' },
              { name: 'Fizetési módok', path: '/payment-methods' },
              { name: 'Kifizetett ételek', path: '/paid-orders' },
              { name: 'Szekciók', path: '/sections' },
              { name: 'Felhasználók', path: '/users' },
              { name: 'Nyitvatartás', path: '/opening-hours' }
            ]" :isOpen="openMenu === 'AdminPanel'" @toggle="toggleMenu('AdminPanel')" />
            <router-link v-if="isReservationsVisible" to="/reservations"
              class="navbar-link">Foglaláskezelés</router-link>
            <router-link v-if="isOrdersVisible" to="/orders" class="navbar-link">Rendelések</router-link>
            <router-link v-if="isCashoutVisible" to="/cashout" class="navbar-link">Kassza</router-link>
          </div>

          <div class="menu-items">
            <MenuDropdown v-if="isAdminVisible" title="Admin Panel" :items="[
              { name: 'Termékek', path: '/items' },
              { name: 'Kategóriák', path: '/categories' },
              { name: 'Asztalok', path: '/tables' },
              { name: 'Fizetési módok', path: '/payment-methods' },
              { name: 'Kifizetett ételek', path: '/paid-orders' },
              { name: 'Szekciók', path: '/sections' },
              { name: 'Felhasználók', path: '/users' },
              { name: 'Nyitvatartás', path: '/opening-hours' }
            ]" :isOpen="openMenu === 'AdminPanel'" @toggle="toggleMenu('AdminPanel')" />
            <router-link v-if="isReservationsVisible" to="/reservations"
              class="navbar-link">Foglaláskezelés</router-link>
            <router-link v-if="isOrdersVisible" to="/orders" class="navbar-link">Rendelések</router-link>
            <router-link v-if="isCashoutVisible" to="/cashout" class="navbar-link">Kassza</router-link>
          </div>
        </div>
        <button @click="logout" class="logout-button">
          Kijelentkezés
          <svg-icon type="mdi" :path="iconPath" />
        </button>
      </div>
    </nav>

    <div class="content">
      <h1 class="brand-name">Plate<span class="colored-text">Mate</span></h1>
      <p class="slogen">Taste the difference</p>
    </div>

    <footer class="footer">
      <div class="footer-container">
        <div class="social-icons">
          <a href="https://facebook.com" target="_blank" aria-label="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="https://discord.com" target="_blank" aria-label="Discord">
            <i class="fab fa-discord"></i>
          </a>
          <a href="https://instagram.com" target="_blank" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>

        <p class="footer-text">
          <i class="fas fa-envelope"></i>
          Kapcsolat: <a href="mailto:platemate@gmail.com">platemate@gmail.com</a>
        </p>
        <p class="footer-text">
          <i class="fas fa-phone"></i>
          Telefon: <a href="tel:+36301234567">+36 30 123 4567</a>
        </p>
        <p class="footer-text">
          <i class="fas fa-copyright"></i>
          2024 PlateMate. Minden jog fenntartva.
        </p>
      </div>
    </footer>

  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />
</template>

<style scoped>
.above-body {
  margin: auto;
  text-align: center;
  margin-top: 13%;
}

.content {
  margin: auto;
  text-align: center;
}

.brand-name {
  font-size: 4em;
  color: white;
  font-weight: 1000;
}

.colored-text {
  color: #49d0ce;
}

.slogen {
  font-size: 2em;
  font-style: italic;
  font-weight: 600;
}

.footer {
  color: #ffffff;
  text-align: center;
  padding: 20px 0;
  margin-top: 20px;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-text {
  margin: 5px 0;
  font-size: 0.9em;
}

.footer-text a {
  color: #49d0ce;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}

.social-icons {
  margin-top: 15px;
}

.social-icons a {
  margin: 0 10px;
  color: #49d0ce;
  font-size: 1.5em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #ffffff;
}

.footer-text i {
  margin-right: 8px;
  color: #49d0ce;
}
</style>
