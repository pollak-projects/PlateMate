<script>
import axios from 'axios';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiEye, mdiEyeOff, mdiLogin } from '@mdi/js'; 

import Popup from '../../components/popup/Popup.vue';

export default {
  components: {
    Popup,
    SvgIcon,
  },
  data() {
    return {
      email: null,
      password: null,
      showPassword: false, 
      popupMessage: null,
      popupType: null,
      popupVisible: false,
      iconPath: mdiLogin,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.showPassword ? mdiEyeOff : mdiEye;
    },
  },
  async mounted() {
    console.log(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`)
    try {
      await this.redirectHandler();
    } catch (error) {
      this.triggerPopup('Hiba történt a betöltés során!', 'error');
    }
  },
  methods: {
    async redirectHandler() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/redirect`, {
          params: { page: 'login' },
          withCredentials: true,
        });

        if (response.data.isAuthorized == true) this.$router.push({ name: 'Home' });
      } catch (error) {
        this.triggerPopup('Hiba történt a betöltés során!', 'error');
      }
    },
    async login() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/login`, {
            email: this.email,
            password: this.password,
          },
          {
            withCredentials: true,
            validateStatus: function (status) {
              return status >= 200 && status < 500;
            },
          }
        );

        if (response.status == 200) this.$router.push({ name: 'Home' });
        else this.triggerPopup('Érvénytelen bejelentkezési adatok!', 'warning');
      } catch (error) {
        this.triggerPopup('Hiba a szerverre történő csatlakozás során!', 'error');
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    triggerPopup(message, type) {
      this.popupMessage = message;
      this.popupType = type;
      this.popupVisible = true;

      setTimeout(() => {
        this.popupVisible = false;
      }, 3000);
    },
  },
};
</script>

<template>
  <div>
    <section class="background">
    <div class="wrapper">
      <div class="content-box">
        <div class="form-container">
          <h1 class="title">Bejelentkezés</h1>
          <form @submit.prevent="login" class="form">
            <div class="input-group">
              <label for="email" class="email-label">Email</label>
              <input type="email" v-model="email" name="email" id="email" class="email-input" placeholder="name@gmail.com" required />
            </div>
            <div class="input-group password-container">
              <label for="password" class="password-label">Jelszó</label>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" name="password" id="password" placeholder="••••••••" class="password-input" required />
              <span class="password-toggle" @click="togglePassword">
                <svg-icon type="mdi" :path="passwordToggleIcon" />
              </span>
            </div>
            <button type="submit" class="login-button">
              Bejelentkezés<svg-icon type="mdi" :path="iconPath"></svg-icon>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />
</template>

<style scoped>
.background {
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.content-box {
  width: 100%;
  max-width: 600px;
  background-color: #282828;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  overflow: hidden;
}

.form-container {
  padding: 16px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 32px;
  color: white;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
}

.password-container {
  position: relative;
}

.email-label,
.password-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.email-input,
.password-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #49d0ce;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  background-color: #3f3f3f;
  outline: none;
  transition: border-color 0.2s ease;
}

.password-toggle {
  color: rgba(255, 255, 255, 0.667);
  position: absolute;
  top: 69%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  padding: 16px;
  background-color: #49d0ce;
  color: black;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.login-button:hover {
  background-color: #56b6b1;
}

@media (max-width: 768px) {
  .content-box {
    max-width: 90%;
    padding: 30px;
  }

  .title {
    font-size: 28px;
  }

  .login-button {
    font-size: 16px;
    padding: 12px;
  }

  .email-input,
  .password-input {
    font-size: 16px;
    padding: 12px;
  }
}
</style>
