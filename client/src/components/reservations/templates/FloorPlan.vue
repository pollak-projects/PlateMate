<script>
export default {
  data() {
    return {
      selectedTable: null,
    };
  },
  methods: {
    selectTable(id) {
      this.selectedTable = id;
      this.$emit("tableSelected", id);
    },
    tableClass(id) {
      return this.selectedTable === id ? "table-selected" : "table-unselected";
    },
  },
};
</script>

<template>
  <div class="reservation-container">
    <h2 class="title">Asztalfoglalás</h2>
    <table class="reservation-table">
      <tbody>
        <tr>
          <td class="table-cell">
            <div :class="tableClass(1)" @click="selectTable(1)">1</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(2)" @click="selectTable(2)">2</div>
          </td>
          <td class="table-counter" colspan="2">
            <div class="counter-content">Pult</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(9)" @click="selectTable(9)">9</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(10)" @click="selectTable(10)">10</div>
          </td>
        </tr>
        <tr>
          <td class="table-cell">
            <div :class="tableClass(3)" @click="selectTable(3)">3</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(4)" @click="selectTable(4)">4</div>
          </td>
          <td colspan="2" class="empty-cell"></td>
          <td class="table-cell">
            <div :class="tableClass(11)" @click="selectTable(11)">11</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(12)" @click="selectTable(12)">12</div>
          </td>
        </tr>
        <tr>
          <td class="table-cell">
            <div :class="tableClass(5)" @click="selectTable(5)">5</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(6)" @click="selectTable(6)">6</div>
          </td>
          <td colspan="2" class="empty-cell"></td>
          <td class="table-cell">
            <div :class="tableClass(13)" @click="selectTable(13)">13</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(14)" @click="selectTable(14)">14</div>
          </td>
        </tr>
        <tr>
          <td class="table-cell">
            <div :class="tableClass(7)" @click="selectTable(7)">7</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(8)" @click="selectTable(8)">8</div>
          </td>
          <td colspan="2" class="empty-cell"></td>
          <td class="table-cell">
            <div :class="tableClass(15)" @click="selectTable(15)">15</div>
          </td>
          <td class="table-cell">
            <div :class="tableClass(16)" @click="selectTable(16)">16</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.reservation-container {
  flex: 1;
  background-color: #2d2d2d;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #ffffff;
}

.reservation-table {
  width: 100%;
  max-width: 800px;
  border-collapse: separate;
  border-spacing: 8px;
}

.table-cell {
  width: 16.666%;
  text-align: center;
}

.table-counter {
  width: 33.333%;
  text-align: center;
  background-color: #49d0ce;
  color: black;
  border-radius: 4px;
}

.counter-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.table-unselected,
.table-selected {
  color: #ffffff;
  background-color: #4a4a4a;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
}

.table-selected {
  color: black;
  background-color: #49d0ce;
}

.empty-cell {
  text-align: center;
}

td {
  min-width: 50px;
}

@media (max-width: 600) {
  td {
    min-width: 40px;
  }
}

@media (max-width: 480px) {
  td {
    min-width: 30px;
  }

  .reservation-table {
    max-width: 100%;
  }

  .table-cell,
  .table-counter {
    width: auto;
  }

  .table-unselected,
  .table-selected {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 320px) {
  .title {
    font-size: 0.875rem;
    margin-bottom: 12px;
  }

  .reservation-container {
    padding: 8px;
  }

  .table-unselected,
  .table-selected {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }

  .reservation-table {
    border-spacing: 4px;
  }

  .table-counter {
    font-size: 0.75rem;
    padding: 4px;
  }
}
</style>
