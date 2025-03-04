<script>
import axios from 'axios';

import Popup from '../../popup/Popup.vue';

export default {
  name: "UserList",
  components: {
    Popup
  },
  data() {
    return {
      users: [],
      searchQuery: '',
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.userName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  async mounted() {
    try {
      await this.getUsers();
    } catch (error) {
      this.triggerPopup("Hiba a betöltés során!", "error")
    }
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/`, {
          withCredentials: true
        });

        if (response.status == 200) this.users = response.data.data;
        if (response.status == 204) this.users = [];
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async deleteUser(id) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/user/${id}`, {
          withCredentials: true
        });

        if (response.status == 200) {
          this.getUsers()
          this.triggerPopup("Sikeres törlés!", "success")
        } else this.triggerPopup("Sikertelen törlés!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen törlés!", "error")
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
    <h2 class="form-title">Felhasználók</h2>
    <div v-if="users.length <= 0">
      <h1 class="form-title">Nincsenek elérhető felhasználók</h1>
    </div>
    <div v-if="users.length > 0" class="search-container">
      <input v-model="searchQuery" type="text" placeholder="Keresés" class="search-input" />
    </div>
    <div v-if="users.length > 0" class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Email</th>
            <th>Szekció</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td>{{ user.userId }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.sectionName }}</td>
            <td>
              <button @click="deleteUser(user.userId)" class="delete-button">
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

.user-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #575757;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-table th,
.user-table td {
  padding: 12px;
  font-size: 14px;
  color: white;
}

.user-table thead th {
  position: sticky;
  top: 0;
  background-color: #3f3f3f;
  color: white;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 1;
}

.user-table tbody tr:hover {
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