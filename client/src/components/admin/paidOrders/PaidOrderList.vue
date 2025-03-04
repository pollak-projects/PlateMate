<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  components: {
    Popup
  },
  name: "TableList",
  data() {
    return {
      paidOrders: [],
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  async mounted() {
    try {
      await this.getPaidOrders();
    } catch (error) {
      console.error("Hiba az ellenőrzés során:", error);
    }
  },
  methods: {
    async getPaidOrders() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/paid/`, {
          withCredentials: true,
          validateStatus: function (status) {
            return status >= 200 && status < 500;
          }
        });

        if (response.status == 200) this.paidOrders = response.data.data;
        if (response.status === 204) this.paidOrders = [];
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async deletePaidOrder(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/paid/${id}`, {
          withCredentials: true
        });

        if (response.status == 200) {
          await this.getPaidOrders();
          this.triggerPopup("Sikeres törlés!", "success")
        } else this.triggerPopup("Sikertelen törlés!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen törlés!", "error")
      }
    },
    formatDateTime(isoString) {
      const date = new Date(isoString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
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
    <h2 class="form-title">Kifizetett Termékek</h2>
    <div v-if="paidOrders.length <= 0">
      <h1 class="form-title">Nincsenek elérhető Kifizetett Termékek</h1>
    </div>
    <div v-if="paidOrders.length > 0" class="table-container">
      <table class="paid-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asztalszám</th>
            <th>Fogyasztott termék</th>
            <th>Termék ára</th>
            <th>Fizetési mód</th>
            <th>Fizetés ideje</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(paidOrder, index) in paidOrders" :key="index">
            <td>{{ paidOrder.id }}</td>
            <td>{{ paidOrder.tableNumber }}</td>
            <td>{{ paidOrder.itemName }}</td>
            <td>{{ paidOrder.itemPrice }}</td>
            <td>{{ paidOrder.paymentMethodName }}</td>
            <td>{{ formatDateTime(paidOrder.paidAt) }}</td>
            <td>
              <button @click="deletePaidOrder(paidOrder.id)" class="delete-button">
                Törlés
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
  max-width: 700px;
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
  max-height: 400px;
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

.paid-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.paid-table th,
.paid-table td {
  padding: 12px;
  font-size: 14px;
  color: white;
}

.paid-table thead th {
  position: sticky;
  top: 0;
  background-color: #3f3f3f;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.paid-table tbody tr:hover {
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