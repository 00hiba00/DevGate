<template>
    <div :class="['competence-list', viewMode]">
      <div v-for="competence in competences" :key="competence.id" class="competence-card">
        <h3 class="font-bold text-lg">{{ competence.name }}</h3>
        <p><strong>Niveau :</strong> {{ competence.level }}</p>
        <p><strong>Date d'acquisition :</strong> {{ competence.acquisitionDate }}</p>
        <p><strong>Date de progression:</strong> {{ competence.progressionDate }}</p>

        <div class="mt-3 flex gap-2">
            <button @click="$emit('edit', competence)">Modifier</button>
            <button @click="confirmDelete(competence)">Supprimer</button>
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

  const confirmDelete = (competence) => {
  if (confirm(`Es-tu sûr de vouloir supprimer "${competence.name}" ?`)) {
    emit('delete', competence)
  }
}
  </script>
  
  <style>
  @import '../assets/styles/competencelist.css';
  </style>
