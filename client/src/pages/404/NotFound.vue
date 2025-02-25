<script>
export default {
  name: "NotFound",
};
</script>

<template>
  <div>
    <section class="not-found">
    <div class="not-found-body">
      <h2>404 - Az oldal nem található</h2>
      <p>Kérlek ellenőrizd az URL-t, vagy menj vissza a kezdőlapra.</p>
      <button class="to-home-button"><router-link to="/" class="router-link">Kezdőlap</router-link></button>
    </div>
  </section>
  </div>
</template>

<style scoped>
h2 {
  font-size: 250%;
}

.not-found {
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.not-found-body {
  text-align: center;
  width: 100%;
  max-width: 600px;
  background-color: #282828;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  overflow: hidden;
  margin: 20px;
}

.to-home-button {
  width: 50%;
  padding: 10px;
  background-color: #49d0ce;
  color: black;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-top: 5%;
}
</style>