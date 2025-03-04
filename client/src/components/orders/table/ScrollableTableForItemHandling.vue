<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    hideAddButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div class="table-container">
    <table class="item-table">
      <thead>
        <tr>
          <th>Név</th>
          <th>Művelet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>{{ item.name }}</td>
          <td>
            <button v-if="!hideAddButton" @click="$emit('add-item', item)" class="add-button">
              Hozzáadás
            </button>
            <button v-else @click="$emit('remove-item', index)" class="remove-button">
              Eltávolítás
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  max-height: 400px;
  min-height: 400px;
  background-color: #3f3f3f;
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
  font-size: 15px;
  font-weight: 600;
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

.add-button,
.remove-button {
  background-color: #49d0ce;
  color: black;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.add-button:hover,
.remove-button:hover {
  background-color: #56b6b1;
}
</style>