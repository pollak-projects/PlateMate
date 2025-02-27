<script>
import axios from 'axios';

import Popup from '../popup/Popup.vue';

export default {
  name: "Cashout",
  components: {
    Popup
  },
  data() {
    return {
      items: [],
      tables: [],
      paymentMethods: [],
      sumPrice: 0,
      selectedPaymentMethod: '',
      selectedTable: '',
      tablesLoading: true,
      paymentsLoading: true,
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  async mounted() {
    try {
      await this.getTables();
      await this.getPaymentMethods();
    } catch (error) {
      this.triggerPopup("Sikertelen a betöltés során!", "error");
    }
  },
  methods: {
    async getTables() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/table/`, {
          withCredentials: true
        });

        if (response.status == 200) {
          this.tables = response.data.data;
          this.tablesLoading = false;
        }
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async getPaymentMethods() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/payment-method/`, {
          withCredentials: true
        });

        if (response.status == 200) {
          this.paymentMethods = response.data.data;
          this.paymentsLoading = false;
        }
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")

      }
    },
    async getConsumedItems(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/order/for-checkout/${id}`, {
          withCredentials: true
        });

        if (response.status == 200) this.items = response.data.data;
        else this.items = []
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async deleteOrders(ids) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/order/mass-delete/`,
          {
            data: { items: ids },
            withCredentials: true
          });

      } catch (error) {
        this.triggerPopup("Sikertelen törlés!", "error")
      }
    },
    async onTableChange() {
      try {
        await this.getConsumedItems(this.selectedTable);
        this.sumPrice = this.items.reduce((total, item) => total + (item.itemPrice || 0), 0);
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async sendPaid() {
      const ids = this.items.map(item => item.itemId);

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/paid/`,
          {
            tableId: this.selectedTable,
            paymentMethodId: this.selectedPaymentMethod,
            items: ids
          },
          {
            withCredentials: true
          });

        if (response.status == 200) {
          this.triggerPopup("Sikeres kifizetés!", "success")
          const orderIds = this.items.map(item => item.id)
          await this.deleteOrders(orderIds)
          window.location.reload()
        }
      } catch (error) {
        this.triggerPopup("Sikertelen kifizetés!", "error")
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
  },
};
</script>

<template>

  <div class="form-container">
    <h2 class="form-title">Elfogyasztott termékek</h2>
    <div class="table-container">
      <table class="item-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Ár</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.id }}</td>
            <td>{{ item.itemName }}</td>
            <td>{{ item.itemPrice }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <label class="form-label">Asztalszám</label>
    <div class="loading-spinner" v-if="tablesLoading">
      <div class="spinner"></div>
    </div>
    <select id="dropdown" v-model="selectedTable" @change="onTableChange" v-if="!tablesLoading" class="form-input">
      <option v-for="table in tables" :key="table.id" :value="table.id">
        {{ table.tableNumber }}
      </option>
    </select>

    <label class="form-label">Fizetési mód</label>
    <div class="loading-spinner" v-if="paymentsLoading">
      <div class="spinner"></div>
    </div>
    <select id="dropdown" v-model="selectedPaymentMethod" v-if="!paymentsLoading" class="form-input">
      <option v-for="paymentMethod in paymentMethods" :key="paymentMethod.id" :value="paymentMethod.id">
        {{ paymentMethod.name }}
      </option>
    </select>

    <h2 class="form-label">Végösszeg: {{ sumPrice }}</h2>

    <button @click="sendPaid()" class="form-submit">
      Kifizetés
    </button>

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

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.search-input {
  width: 50%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #49d0ce;
  background-color: #3f3f3f;
  color: white;
  outline: none;
}

.search-input::placeholder {
  text-align: center;
}

.search-input:hover,
.search-input:focus {
  border-color: #b9ebe9;
  background-color: #4a4a4a;
}

.table-container {
  max-height: 400px;
  min-height: 400px;
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

.item-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-table th,
.item-table td {
  padding: 12px;
  font-size: 18px;
  font-weight: 500;
  color: white;
}

.item-table thead th {
  position: sticky;
  top: 0;
  background-color: #3f3f3f;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.item-table tbody tr:hover {
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

.form-label {
  display: block;
  color: white;
  margin-bottom: 8px;
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