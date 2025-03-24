<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  components: {
    Popup
  },
  name: "PaymentMethodList",
  data() {
    return {
      paymentMethods: [],
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  async mounted() {
    try {
      await this.getPaymentMethods();
    } catch (error) {
      this.triggerPopup("Hiba a betöltés során!", "error");
    }
  },
  methods: {
    async getPaymentMethods() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/payment-method/`, {
          withCredentials: true
        });

        if (response.status === 200) this.paymentMethods = response.data.data;
        if (response.status === 204) this.paymentMethods = [];
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error");
      }
    },
    async deletePaymentMethod(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/payment-method/${id}`, {
          withCredentials: true
        });

        if (response.status === 200) {
          this.getPaymentMethods();
          this.triggerPopup("Sikeres törlés!", "success");
        } else this.triggerPopup("Sikertelen törlés!", "error");
      } catch (error) {
        this.triggerPopup("Sikertelen törlés!", "error");;
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
  }
};
</script>

<template>
  <div class="form-container">
    <h2 class="form-title">Fizetési módok</h2>
    <div v-if="paymentMethods.length <= 0">
      <h1 class="form-title">Nincsenek elérhető fizetési módok</h1>
    </div>
    <div v-if="paymentMethods.length > 0" class="table-container">
      <table class="payment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(paymentMethod, index) in paymentMethods" :key="index">
            <td>{{ paymentMethod.id }}</td>
            <td>{{ paymentMethod.name }}</td>
            <td>
              <button @click="deletePaymentMethod(paymentMethod.id)" class="delete-button">
                Törlés
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />
  </div>
</template>

<style scoped>
.form-container {
  background-color: #282828;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  margin: auto;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.table-container {
  overflow-y: auto;
  border: #49d0ce solid 2px;
}

.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #49d0ce;
  border-radius: 2px;
}

.table-container::-webkit-scrollbar-track {
  background-color: #575757;
}

.table-container::-webkit-scrollbar-corner {
  background-color: #49d0ce;
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.payment-table th,
.payment-table td {
  padding: 12px;
  font-size: 14px;
  color: white;
}

.payment-table thead th {
  position: sticky;
  top: 0;
  background-color: #3f3f3f;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.payment-table tbody tr:hover {
  background-color: #717171;
}

.delete-button {
  background-color: #49d0ce;
  color: black;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #56b6b1;
}
</style>