<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  name: "OpeningHourList",
  components: {
    Popup
  },
  data() {
    return {
      hours: [],
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  async mounted() {
    try {
      await this.getOpeningHours();
    } catch (error) {
      this.triggerPopup("Hiba a betöltés során!", "error")
    }
  },
  methods: {
    async getOpeningHours() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/opening-hours/`, {
          withCredentials: true
        });

        if (response.status == 200) {
          const data = response.data.data;
          this.hours = this.sortDaysOfWeek(data);
        }
        if (response.status == 204) this.hours = [];
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async deleteOpeningHour(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/opening-hours/${id}`, {
          withCredentials: true
        });

        if (response.status == 200) {
          const data = await this.getOpeningHours();
          this.hours = this.sortDaysOfWeek(data)
          this.triggerPopup("Sikeres törlés!", "success")
        } else this.triggerPopup("Sikertelen törlés!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen törlés!", "error")
      }
    },
    sortDaysOfWeek(days) {
      const weekOrder = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

      return days.sort((a, b) => weekOrder.indexOf(a.dayName) - weekOrder.indexOf(b.dayName));
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
    <h2 class="form-title">Nyitvatartás</h2>
    <div v-if="hours.length <= 0">
      <h1 class="form-title">Nincsenek elérhető időpontok</h1>
    </div>
    <div v-if="hours.length > 0" class="table-container">
      <table class="hours-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nap</th>
            <th>Ettől</th>
            <th>Eddig</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hour, index) in hours" :key="index">
            <td>{{ hour.id }}</td>
            <td>{{ hour.dayName }}</td>
            <td>{{ hour.fromHour }}</td>
            <td>{{ hour.untilHour }}</td>
            <td>
              <button @click="deleteOpeningHour(hour.id)" class="delete-button">
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

.hours-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hours-table th,
.hours-table td {
  padding: 12px;
  font-size: 14px;
  color: white;
}

.hours-table th {
  background-color: #3f3f3f;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
}

.hours-table tr:hover {
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