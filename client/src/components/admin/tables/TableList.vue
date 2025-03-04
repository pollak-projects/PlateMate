<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  name: "TableList",
  components: {
    Popup
  },
  data() {
    return {
      tables: [],
      searchQuery: '',
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  async mounted() {
    try {
      await this.getTables();
    } catch (error) {
      this.triggerPopup("Hiba a betöltés során!", "error");
    }
  },
  methods: {
    async getTables() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/table/`, {
          withCredentials: true
        });

        if (response.status == 200) this.tables = response.data.data.sort((a, b) => a.tableNumber - b.tableNumber)
        if (response.status == 204) this.tables = [];
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error");
      }
    },
    async deleteTable(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/table/${id}`, {
          withCredentials: true
        });
        if (response.status == 200) {
          this.getTables();
          this.triggerPopup("Sikeres törlés!", "success");
        } else this.triggerPopup("Sikertelen törlés!", "error");
      } catch (error) {
        console.log(error)
        this.triggerPopup("Sikertelen törlés!", "error");
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
    <h2 class="form-title">Asztalok</h2>
    <div v-if="tables.length <= 0">
      <h1 class="form-title">Nincsenek elérhető asztalok</h1>
    </div>
    <div v-if="tables.length > 0" class="table-container">
      <table class="table-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asztalszám</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(table, index) in tables" :key="index">
            <td>{{ table.id }}</td>
            <td>{{ table.tableNumber }}</td>
            <td>
              <button @click="deleteTable(table.id)" class="delete-button">
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

.table-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-table th,
.table-table td {
  padding: 12px;
  font-size: 14px;
  color: white;
}

.table-table thead th {
  position: sticky;
  top: 0;
  background-color: #3f3f3f;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.table-table tbody tr:hover {
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