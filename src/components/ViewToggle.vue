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
  .btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: #f9f9f9;
    cursor: pointer;
    border-radius: 6px;
  }
  
  .btn-active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
  </style>
  