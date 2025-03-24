<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';
import { popScopeId } from 'vue';

export default {
  components: {
    Popup
  },
  name: "PaymentMethodAdd",
  data() {
    return {
      formData: {
        PaymentMethodName: ''
      },
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  methods: {
    async createPaymentMethod() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/payment-method`, { name: this.formData.PaymentMethodName }, {
          withCredentials: true
        });

        if (response.status == 200) { 
          this.triggerPopup("Sikeres létrehozás", "success") 
          this.formData.PaymentMethodName = null
        }
        else this.triggerPopup("Sikertelen létrehozás!", "error")
      }
      catch (error) {
        this.triggerPopup("Sikertelen létrehozás!", "error")
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
  }
};
</script>

<template>
  <div class="form-container">
    <h2 class="form-title">Fizetési mód készítés</h2>
    <form @submit.prevent="createPaymentMethod">
      <div class="form-group">
        <label class="form-label">Neve</label>
        <input type="text" placeholder="Új fizetési mód" v-model="formData.PaymentMethodName" class="form-input" required />
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

.form-input:hover {
  border-color: #b9ebe9;
  background-color: #4a4a4a;
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
</style>