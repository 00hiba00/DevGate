<template>
    <div :class="['project-list', viewMode]">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <h3 class="font-bold text-lg">{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <p><strong>Stack :</strong> {{ project.stack.join(', ') }}</p>
        <a :href="project.github" target="_blank" class="text-blue-500 underline">
          Voir sur GitHub
        </a>
        <div class="mt-3 flex gap-2">
          <button @click="editProject(project)">Modifier</button>
          <button @click="$emit('delete', project.id)">Supprimer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    projects: Array,
    viewMode: String
  })
  
  const emit = defineEmits(['delete', 'edit'])
  
  const editProject = (project) => {
    emit('edit', project)
  }
  </script>
  
  <style scoped>
  /* Styles pour la carte du projet */
  .project-card {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    transition: transform 0.2s ease;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
  }
  
  .project-card button {
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
  
  .project-card button:hover {
    background-color: #36976f;
  }
  </style>
  