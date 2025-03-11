<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  name: "ItemAdd",
  components: {
    Popup
  },
  data() {
    return {
      formData: {
        name: null,
        price: null,
        categoryId: null,
        categories: []
      },
      loading: true,
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  async mounted() {
    try {
      await this.getCategories();
    } catch (error) {
      this.triggerPopup("Sikertelen a betöltés során!", "error");
    }
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/category/`, {
          withCredentials: true
        });

        if (response.status == 200) {
          this.categories = response.data.data;
          this.loading = false;
        } else this.triggerPopup("Sikertelen lekérdezés!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async createItem() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/item`, {
          name: this.formData.name,
          price: this.formData.price,
          categoryId: this.formData.categoryId
        },
          {
            withCredentials: true
          });

        if (response.status == 200) { 
          this.triggerPopup("Sikeres létrehozás!", "success")
          this.formData.name = null; 
          this.formData.price = null;
          this.formData.categoryId = null;
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
    <h2 class="form-title">Termék Létrehozás</h2>
    <form @submit.prevent="createItem">
      <div class="form-group">
        <label class="form-label">Termék név</label>
        <input type="text" v-model="formData.name" class="form-input" required />
        <label class="form-label">Termék ára</label>
        <input type="number" v-model="formData.price" class="form-input" required />
        <label class="form-label">Kategória</label>
        <div class="loading-spinner" v-if="loading">
          <div class="spinner"></div>
        </div>
        <select id="dropdown" v-model="formData.categoryId" v-if="!loading" class="form-input" required>
          <option v-for="category in categories" :key="category.id" :value="category.id" class="input-select">
            {{ category.name }}
          </option>
        </select>
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

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 15px;
}

.spinner {
  border: 8px solid #4a4a4a;
  border-top: 8px solid #49d0ce;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>