<template>
    <div class="flex gap-4 mb-4">
      <button
        :class="['btn', current === 'grid' ? 'btn-active' : '']"
        @click="$emit('toggle', 'grid')"
      >
        Galerie
      </button>
      <button
        :class="['btn', current === 'list' ? 'btn-active' : '']"
        @click="$emit('toggle', 'list')"
      >
        Liste
      </button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    current: String
  })
  
  defineEmits(['toggle'])
  </script>
  
  <style scoped>
/* Container for the buttons */
.flex {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

/* Button Styles */
.btn {
  background-color: #6a5bff; /* Blue-violet */
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  border: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
  width: 100%; /* Ensure buttons stretch to fill the container evenly */
}

/* Hover effect for buttons */
.btn:hover {
  background-color: #4e45cc; /* Darker blue-violet */
  transform: scale(1.05);
}

/* Active state for the selected button */
.btn-active {
  background-color: #4e45cc; /* Darker blue-violet for active state */
  border: 2px solid #3a3c9d; /* Border color for better contrast */
}

/* Focus effect to improve accessibility */
.btn:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(106, 91, 255, 0.7);
}
</style>
