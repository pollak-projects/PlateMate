<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    popupType: {
      type: String,
      required: true,
      validator(value) {
        return ["success", "warning", "error"].includes(value);
      },
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    alertClass() {
      return {
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-error",
      }[this.popupType];
    },
  },
};
</script>

<template>
  <div v-if="isVisible" class="alert" :class="alertClass">
    <svg
      v-if="popupType === 'success'"
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <svg
      v-if="popupType === 'warning'"
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <svg
      v-if="popupType === 'error'"
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.alert {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  gap: 12px;
  z-index: 9999;
}

.alert-success {
  background-color: #4caf50; 
  color: black;
}

.alert-warning {
  background-color: #ffc107; 
  color: black;
}

.alert-error {
  background-color: #f44336;
  color: white;
}

.icon {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  flex-shrink: 0;
}
</style>