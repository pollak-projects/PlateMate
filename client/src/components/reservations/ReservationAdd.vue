<script>
import axios from 'axios';

import FloorPlan from './templates/FloorPlan.vue';
import Popup from '../popup/Popup.vue';

export default {
  name: "ReservationAdd",
  components: {
    FloorPlan,
    Popup
  },
  data() {
    return {
      loading: true,
      name: null,
      nOfCustomers: null,
      date: null,
      formattedDate: null,
      day: null,
      startTime: null,
      endTime: null,
      selectedTableId: null,
      reservations: [],
      reservedTimes: [],
      availableStartTimes: [],
      availableEndTimes: [],
      selectedStartTime: null,
      selectedEndTime: null,
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    };
  },
  methods: {
    async getAvailableTimes() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/opening-hours/`, {
          withCredentials: true
        });

        if (response.status === 200) {
          const dayData = response.data.data.find(time => time.dayName === this.day);

          if (dayData) {
            this.startTime = new Date(`1970-01-01T${dayData.fromHour}:00`);
            this.endTime = new Date(`1970-01-01T${dayData.untilHour}:00`);
          }
        }
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async getReservationOnDayByTable() {
      if (this.selectedTableId != null && this.date != null) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/reservation/reservations-on-day`, {
            params: {
              tableNumber: this.selectedTableId,
              fromDate: this.date
            },
            withCredentials: true
          });

          if (response.status === 200) this.reservations = response.data.data;
          return response;
        } catch (error) {
          this.triggerPopup("Sikertelen lekérdezés!", "error")
        }
      }
    },
    async postReservation() {
      if (!this.selectedTableId ||
        !this.name ||
        !this.nOfCustomers ||
        !this.selectedStartTime ||
        !this.selectedEndTime
      ) {
        this.triggerPopup("Minden mező megadása közelező!", "warning")
        return
      }

      if (this.selectedStartTime.split(':')[0] > this.selectedEndTime.split(':')[0]) {
        this.triggerPopup("Érvénytelen időzóna!", "warning")
        return
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/reservation`, {
          tableNumber: this.selectedTableId,
          name: this.name,
          numberOfCustomers: this.nOfCustomers,
          reservedAt: this.date + " " + this.selectedStartTime,
          reservedUntil: this.date + " " + this.selectedEndTime
        }, {
          withCredentials: true
        });

        if (response.status == 200) { 
          this.triggerPopup("Sikeres létrehozás!", "success")
          window.location.reload()
        }
        else this.triggerPopup("Sikertelen létrehozás!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen létrehozás!", "error")
      }
    },
    formatDate(dateg) {
      const year = dateg.getFullYear();
      const month = String(dateg.getMonth() + 1).padStart(2, '0');
      const day = String(dateg.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    handleTableSelection(id) {
      this.selectedTableId = id;
      this.loadDropdowns()
    },
    async loadDropdowns() {
      this.day = new Intl.DateTimeFormat('hu-HU', { weekday: 'long', timeZone: 'Europe/Budapest' }).format(new Date(this.date));
      this.day = this.day.charAt(0).toUpperCase() + this.day.slice(1);

      await this.getAvailableTimes();
      const response = await this.getReservationOnDayByTable();

      this.availableStartTimes = [];
      this.availableEndTimes = [];

      if (response.status == 200) {
        let time = new Date(this.startTime);
        while (time <= this.endTime) {
          const timeString = time.toTimeString().slice(0, 5);
          this.availableStartTimes.push(timeString);
          this.availableEndTimes.push(timeString);
          time.setHours(time.getHours() + 1);
        }

        this.availableStartTimes.pop();
        this.availableEndTimes.shift();

        this.reservedTimes = this.reservations.map(reservation => ({
          start: new Date(reservation.reservedAt),
          end: new Date(reservation.reservedUntil)
        }));

        this.availableStartTimes = this.availableStartTimes.filter(startTime => {
          const startDateTime = new Date(`${this.date}T${startTime}:00`);
          return !this.reservedTimes.some(reserved => startDateTime >= reserved.start && startDateTime < reserved.end);
        });

        this.availableEndTimes = this.availableEndTimes.filter(endTime => {
          const endDateTime = new Date(`${this.date}T${endTime}:00`);
          return !this.reservedTimes.some(reserved => endDateTime > reserved.start && endDateTime <= reserved.end);
        });
      } else if (response.status == 204) {
        let time = new Date(this.startTime);
        while (time <= this.endTime) {
          const timeString = time.toTimeString().slice(0, 5);
          this.availableStartTimes.push(timeString);
          this.availableEndTimes.push(timeString);
          time.setHours(time.getHours() + 1);
        }

        this.availableStartTimes.pop();
        this.availableEndTimes.shift();
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

  <div class="card-body">
    <div class="tables-container">
      <div class="table-card">
        <FloorPlan @tableSelected="handleTableSelection" />
      </div>

      <div class="table-card">
        <h2>Adatok</h2>
        <div class="form-group">
          <input type="text" v-model="name" placeholder="Név" class="input-field" />
          <input type="number" v-model="nOfCustomers" placeholder="Fők száma" class="input-field" />
          <input type="date" v-model="date" @change="loadDropdowns" class="input-field" />
          <div class="dropdown-group">
            <label>Ettől</label>
            <select v-model="selectedStartTime" class="dropdown">
              <option v-for="availableTime in availableStartTimes" :key="availableTime" :value="availableTime">
                {{ availableTime }}
              </option>
            </select>
          </div>
          <div class="dropdown-group">
            <label>Eddig</label>
            <select v-model="selectedEndTime" class="dropdown">
              <option v-for="availableTime in availableEndTimes" :key="availableTime" :value="availableTime">
                {{ availableTime }}
              </option>
            </select>
          </div>
          <button @click="postReservation" class="submit">Foglalás</button>
        </div>
      </div>
    </div>
  </div>

  <Popup v-if="popupVisible" :message="popupMessage" :popupType="popupType" :isVisible="popupVisible" />
</template>

<style scoped>
h2 {
  font-weight: 500;
  padding-bottom: 10px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2d2d2d;
  color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #49d0ce;
  border-radius: 4px;
  background-color: #3f3f3f;
  color: white;
  outline: none;
}

.input-field:focus {
  border-color: #b9ebe9;
}

.submit {
  background-color: #49d0ce;
  color: black;
  font-weight: 500;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit:hover {
  background-color: #56b6b1;
}

.dropdown {
  background-color: #3f3f3f;
  color: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #49d0ce;
  outline: none;
  width: 100%;
  transition: border-color 0.3s;
}

.dropdown:focus {
  border-color: #b9ebe9;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #282828;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.tables-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.table-card {
  flex: 1;
  background-color: #2d2d2d;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 750px) {
  .tables-container {
    flex-direction: column;
  }
}
</style>
