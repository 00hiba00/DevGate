<template>
    <div :class="['competence-list', viewMode]">
      <div v-for="competence in competences" :key="competence.id" class="competence-card">
        <h3 class="font-bold text-lg">{{ competence.nom }}</h3>
        <p><strong>Niveau :</strong> {{ competence.niveau }}</p>
        <p><strong>Date d'acquisition :</strong> {{ competence.dateAcquisition }}</p>
        
        <div class="mt-3 flex gap-2">
          <button @click="$emit('edit', competence.id, competence)">Modifier</button>
          <button @click="$emit('delete', competence.id)">Supprimer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    competences: Array,
    viewMode: String
  })
  
  defineEmits(['delete', 'edit'])
  </script>
  
  <style scoped>
  .competence-card {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    transition: transform 0.2s ease;
  }
  
  .competence-card:hover {
    transform: translateY(-5px);
  }
  
  button {
    background-color: #42b983;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    border: none;
  }
  
  button:hover {
    background-color: #36976f;
  }
  </style>
  