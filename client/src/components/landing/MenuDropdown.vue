<script>
export default {
  props: {
    title: String,
    items: Array,
    isOpen: Boolean,
  },
  methods: {
    toggleDropdown() {
      this.$emit('toggle');
    },
  },
};
</script>

<template>
  <div class="dropdown-container">
    <button @click="toggleDropdown" class="dropdown-button">
      {{ title }} ▼
    </button>
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <ul>
          <li v-for="item in items" :key="item.name" class="dropdown-item">
            <router-link :to="item.path" class="dropdown-link">{{ item.name }}</router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #282828;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.dropdown-button:hover {
  background-color: #3f3f3f;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 8px;
  width: 200px;
  background-color: #282828;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  display: none;
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: 10px 16px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #3f3f3f;
}

.dropdown-link {
  color: white;
  text-decoration: none;
  display: block;
  width: 100%;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-container .dropdown-menu {
  display: block;
}

@media (max-width: 768px) {
  .dropdown-button {
    width: 100%;
    font-size: 14px;
    padding: 10px 14px;
  }

  .dropdown-menu {
    width: 100%;
    left: 0;
  }

  .dropdown-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>