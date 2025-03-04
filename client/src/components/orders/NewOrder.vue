<script>
import axios from 'axios';

import ScrollableTableForItemHandling from './table/ScrollableTableForItemHandling.vue';
import Popup from '../popup/Popup.vue';

export default {
  components: { ScrollableTableForItemHandling, Popup },
  name: "NewOrder",
  data() {
    return {
      searchTermForItems: '',
      searchTermForSelectedItems: '',
      selectedTable: 0,
      tables: [],
      items: [], 
      selectedItems: [], 
      selectedItemIds: [],
      popupMessage: null,
      popupType: null,
      popupVisible: false,
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.name.toLowerCase().includes(this.searchTermForItems.toLowerCase()));
    },
    filteredSelectedItems() {
      return this.selectedItems.filter(item => item.name.toLowerCase().includes(this.searchTermForSelectedItems.toLowerCase()));
    }
  },
  async mounted() {
    try {
      await this.getItems();
      await this.getTables();
    } catch (error) {
      this.triggerPopup("Sikertelen a betöltés során!", "error");
    }
  },
  methods: {
    addItemToSelected(item) {
      this.selectedItems.push(item);
    },
    removeItemFromSelected(index) {
      this.selectedItems.splice(index, 1); 
    },
    async putSelectedItemsIdsToArray(){
      this.selectedItemIds = this.selectedItems.map(item => item.id);
    },
    async getTables() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/table/`, {
          withCredentials: true 
        });
        
        if(response.status == 200) this.tables = response.data.data
        else this.triggerPopup("Sikertelen lekérdezés!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async getItems() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/item`, {
          withCredentials: true 
        });
        
        if(response.status == 200) this.items = response.data.data
        else this.triggerPopup("Sikertelen lekérdezés!", "error")
      } catch (error) {
        this.triggerPopup("Sikertelen lekérdezés!", "error")
      }
    },
    async sendOrder(){
      if(this.selectedTable <= 0 || this.selectedItems.length < 1) {
        this.triggerPopup("Minden mező kitöltése kötelező!", "error")
        return
      }

      try {
        await this.putSelectedItemsIdsToArray(); 

        const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/order`, { 
          tableId: this.selectedTable,
          items: this.selectedItemIds,
        }, 
        {
          withCredentials: true
        });

        if(response.status == 200) this.triggerPopup("Sikeres létrehozás!", "success")
        else this.triggerPopup("Sikertelen létrehozás!", "error")
      }
      catch (error){
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
  <div class="card-body">
    <div class="tables-container">
      <div class="table-card">
        <h2>Termékek listája</h2>
        <div class="search-container">
          <input v-model="searchTermForItems" type="text" placeholder="Keresés..." class="search-input" />
        </div>
        <ScrollableTableForItemHandling :items="filteredItems" @add-item="addItemToSelected" />
      </div>

      <div class="table-card">
        <h2>Hozzáadott termékek</h2>
        <div class="search-container">
          <input v-model="searchTermForSelectedItems" type="text" placeholder="Keresés..." class="search-input" />
        </div>
        <ScrollableTableForItemHandling :items="filteredSelectedItems" :hideAddButton="true" @remove-item="removeItemFromSelected" class="asd"/>
      </div>
    </div>

    <div class="table-dropdown">
      <label class="table-label">Asztalszám</label>
      <select id="dropdown" v-model="selectedTable" class="dropdown">
        <option v-for="table in tables" :key="table.id" :value="table.id" class="select">
          {{ table.tableNumber }}
        </option>
      </select>
    </div>
    <button @click="sendOrder()" class="submit">Leadás</button>
  </div>

  <Popup
      v-if="popupVisible"
      :message="popupMessage"
      :popupType="popupType"
      :isVisible="popupVisible"
    />
</template>

<style scoped>
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

.submit {
  width: 50%;
  background-color: #49d0ce;
  color: black;
  font-weight: 500;
  padding: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit:hover {
  background-color: #56b6b1;
}

.dropdown {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #49d0ce;
  border-radius: 4px;
  background-color: #3f3f3f;
  color: white;
  outline: none;
}

.dropdown:focus {
  border-color: #b9ebe9;
}

.select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #3f3f3f;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
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

.table-card h2 {
  color: white;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
}

.table-dropdown {
  padding: 20px;
}

@media (max-width: 750px) {
  .tables-container {
    flex-direction: column;
  }

  .search-input {
    width: 80%;
  }
}
</style>