<template>
    <div :class="['competence-list', viewMode]">
      <div v-for="competence in competences" :key="competence.id" class="competence-card">
        <h3 class="font-bold text-lg">{{ competence.name }}</h3>
        <p><strong>Niveau :</strong> {{ competence.level }}</p>
        <p><strong>Date d'acquisition :</strong> {{ competence.acquisitionDate }}</p>
        <p><strong>Date de progression:</strong> {{ competence.progressionDate }}</p>

        <div class="mt-3 flex gap-2">
            <button @click="$emit('edit', competence)">Modifier</button>
            <button @click="$emit('delete', competence)">Supprimer</button>
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
.competence-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background-color: #f9fafb; /* Soft background */
  min-height: 350px;
}

/* Each card */
.competence-card {
  background: linear-gradient(145deg, #ffffff, #f1f3f6);
  border-radius: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.competence-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Title */
h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

/* Paragraphs */
p {
  color: #555;
  margin: 0.5rem 0;
  font-size: 1rem;
}

/* Bold labels inside paragraphs */
p strong {
  color: #111;
}

/* Buttons */
button {
  background-color: #4f46e5; /* Indigo */
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  font-size: 0.95rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #4338ca;
  transform: scale(1.05);
}

/* Button container */
.mt-3.flex {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

/* Grid vs List view mode */
.competence-list.list {
  display: flex;
  flex-direction: column;
}
</style>
