<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  name: "OpeningHourAdd",
  components: {
    Popup
  },
  data() {
    return {
      formData: {
        day: '',
        from: '',
        until: '',
      },
      loading: true,
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  methods: {
    async createOpeningHour() {
      if (this.validateTimeFormat(this.formData.from) & this.validateTimeFormat(this.formData.until)) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/opening-hours`, {
            day: this.formData.day,
            from: this.formData.from,
            until: this.formData.until
          },
            {
              withCredentials: true
            });

          if (response.status == 200) { 
            this.triggerPopup("Sikeres létrehozás!", "success") 
            this.formData.day = null;
            this.formData.from = null;
            this.formData.until = null;
          }
          else this.triggerPopup("Sikertelen létrehozás!", "error")
        }
        catch (error) {
          this.triggerPopup("Sikertelen létrehozás!", "error")
        }
      } else this.triggerPopup("Érvénytelen időformátum!", "warning")
    },
    validateTimeFormat(value) {
      const regex = /^(?:[01]\d|2[0-3]):00$/;
      return regex.test(value);
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
  <div class="form-container">
    <h2 class="form-title">Termék Létrehozás</h2>
    <form @submit.prevent="createOpeningHour">
      <div class="form-group">
        <label class="form-label">Nap</label>
        <select id="dropdown" v-model="formData.day" class="form-input" required>
          <option>Héftő</option>
          <option>Kedd</option>
          <option>Szerda</option>
          <option>Csütörtök</option>
          <option>Péntek</option>
          <option>Szombat</option>
          <option>Vasárnap</option>
        </select>
        <label class="form-label">Ettől</label>
        <input type="text" placeholder="09:00" v-model="formData.from" class="form-input" required />
        <label class="form-label">Eddig</label>
        <input id="dropdown" placeholder="18:00" v-model="formData.until" class="form-input" required />
      </div>
      <button type="submit" class="form-submit">Létrehozás</button>
    </form>
  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />
</template>

<style scoped>
.form-container {
  background-color: #282828;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  color: white;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #49d0ce;
  border-radius: 4px;
  background-color: #3f3f3f;
  color: white;
  outline: none;
}

.form-input:focus {
  border-color: #b9ebe9;
}

.form-submit {
  width: 100%;
  background-color: #49d0ce;
  color: black;
  font-weight: 500;
  padding: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-submit:hover {
  background-color: #56b6b1;
}

.form-input:hover,
.form-input:focus {
  border-color: #b9ebe9;
  background-color: #4a4a4a;
}

.input-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #3f3f3f;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
}
</style>