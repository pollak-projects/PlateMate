<template>
  <div class="form-container">
    <div id="orders-container">
      <!-- The rendered EJS table will be injected here -->
    </div>

    <label class="form-label">Asztalszám</label>
    <div class="loading-spinner" v-if="tablesLoading">
      <div class="spinner"></div>
    </div>
    <select v-model="selectedTable" @change="handleTableChange()" v-if="!tablesLoading" class="form-input">
      <option v-for="table in tables" :key="table.id" :value="table.id">
        {{ table.tableNumber }}
      </option>
    </select>

    <label class="form-label">Fizetési mód</label>
    <div class="loading-spinner" v-if="paymentsLoading">
      <div class="spinner"></div>
    </div>
    <select v-model="selectedPaymentMethod" v-if="!paymentsLoading" class="form-input">
      <option v-for="paymentMethod in paymentMethods" :key="paymentMethod.id" :value="paymentMethod.id">
        {{ paymentMethod.name }}
      </option>
    </select>

    <h2 class="form-label">Végösszeg: {{ sumPrice }} Ft</h2>

    <button @click="sendPaid()" class="form-submit">
      Kifizetés
    </button>

    <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible"/>
  </div>
</template>

<script>
import axios from 'axios';
import Popup from '../popup/Popup.vue';

export default {
  name: "Cashout",
  components: { Popup },
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
    };
  },
  async mounted() {
    await this.loadTables();
    await this.loadPaymentMethods();
  },
  methods: {
    async loadTables() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/table/`, { withCredentials: true });
        if (response.status === 200) {
          this.tables = response.data.data;
        }
      } catch (error) {
        this.triggerPopup("Hiba történt az asztalok betöltésekor!", "error");
      } finally {
        this.tablesLoading = false;
      }
    },
    async handleTableChange() {
      await this.onTableChange()
      await this.onTableChange2();
    },
    async loadPaymentMethods() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/payment-method/`, { withCredentials: true });
        if (response.status === 200) {
          this.paymentMethods = response.data.data;
        }
      } catch (error) {
        this.triggerPopup("Hiba történt a fizetési módok betöltésekor!", "error");
      } finally {
        this.paymentsLoading = false;
      }
    },
    async onTableChange() {
      if (!this.selectedTable) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/order/for-checkout/${this.selectedTable}`, {
          withCredentials: true,
          responseType: "text"  // Axios expect raw HTML
        });

        if (response.status === 200) {
          document.getElementById("orders-container").innerHTML = response.data; // Inject HTML into a container
        }
      } catch (error) {
        this.triggerPopup("Hiba történt a rendelések lekérdezésekor!", "error");
      }
    },
    async onTableChange2() {
      if (!this.selectedTable) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/order/for-checkout2/${this.selectedTable}`, { withCredentials: true });
        if (response.status === 200) {
          this.items = response.data.data;
          console.log(this.items)

          this.sumPrice = this.items.reduce((total, item) => total + (item.itemPrice || 0), 0);
        } else {
          this.items = [];
        }
      } catch (error) {
        this.triggerPopup("Hiba történt a rendelések lekérdezésekor!", "error");
      }
    },
    async sendPaid() {
      if (!this.selectedTable || !this.selectedPaymentMethod || this.items.length === 0) {
        return this.triggerPopup("Hiányzó adatok! Válassz asztalt és fizetési módot.", "error");
      }

      const itemIds = this.items.map(item => item.itemId);
      const itemId = this.items.map(item => item.id);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/paid/`, {
          tableId: this.selectedTable,
          paymentMethodId: this.selectedPaymentMethod,
          items: itemIds
        }, { withCredentials: true });

        if (response.status === 200) {
          this.triggerPopup("Sikeres kifizetés!", "success");
          await this.deleteOrders(itemId);
          //window.location.reload();
        }
      } catch (error) {
        this.triggerPopup("Hiba történt a kifizetés során!", "error");
      }
    },
    async deleteOrders(ids) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/order/mass-delete/`, {
          data: { items: ids },
          withCredentials: true
        });
      } catch (error) {
        this.triggerPopup("Hiba történt a rendelések törlésekor!", "error");
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

.table-container {
  max-height: 400px;
  overflow-y: auto;
  border: #49d0ce solid 2px;
}

.item-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
}

.item-table th,
.item-table td {
  padding: 12px;
  font-size: 18px;
  color: white;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  margin-top: 10px;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
