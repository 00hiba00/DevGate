<template>
    <div :class="['objectif-list', viewMode]">
      <div
        v-for="objectif in objectifs"
        :key="objectif.id"
        class="objectif-card"
      >
        <h3 class="font-bold text-lg">{{ objectif.title }}</h3>
        <p><strong>Durée :</strong> {{ objectif.duree }}</p>
  
        <!-- Progression -->
        <div class="progress-section">
          <label>Progression : {{ objectif.progres }}%</label>
          <input type="range" :value="objectif.progres" min="0" max="100" disabled class="progress-bar" />
        </div>
  
        <!-- Statut -->
        <div class="status-section">
          <strong>Statut :</strong>
          <span :class="['status', objectif.status === 'Terminé' ? 'completed' : 'in-progress']">
            {{ objectif.status }}
          </span>
        </div>
  
        <div class="mt-3 flex gap-2">
          <button @click="editObjectif(objectif)">Modifier</button>
          <button @click="$emit('delete', objectif.id)">Supprimer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    objectifs: Array,
    viewMode: String
  })
  
  const emit = defineEmits(['delete', 'edit'])
  
  const editObjectif = (objectif) => {
    emit('edit', objectif)
  }
  </script>
  
  <style scoped>
  /* Base styles */
  .objectif-card {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    transition: transform 0.2s ease;
  }
  
  .objectif-card:hover {
    transform: translateY(-5px);
  }
  
  .objectif-card button {
    margin-right: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 600;
    background-color: #42b983;
    color: white;
    transition: background-color 0.2s;
  }
  
  .objectif-card button:hover {
    background-color: #36976f;
  }
  
  /* Progression bar style */
  .progress-section {
    margin-top: 1rem;
  }
  
  .progress-bar {
    width: 100%;
    margin-top: 0.5rem;
    appearance: none;
    height: 6px;
    background: #ddd;
    border-radius: 3px;
  }
  
  .progress-bar::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    background: #42b983;
    border-radius: 50%;
    cursor: pointer;
  }
  
  /* Status style */
  .status-section {
    margin-top: 1rem;
  }
  
  .status {
    padding: 0.3rem 0.6rem;
    border-radius: 0.5rem;
    font-weight: 600;
    margin-left: 0.5rem;
  }
  
  .in-progress {
    background-color: #ffe08a;
    color: #8a6d00;
  }
  
  .completed {
    background-color: #c8f7c5;
    color: #2c7a2c;
  }
  </style>
  