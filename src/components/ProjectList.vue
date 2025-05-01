<template>
    <div :class="['project-list', viewMode]">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-header">
          <h3 class="font-bold text-lg">{{ project.title }}</h3>
          <!-- Display badge for visibility -->
          <span :class="['visibility-badge', project.visibility]">
            {{ project.visibility === 'public' ? 'Public' : 'Privé' }}
          </span>
        </div>
        <p>{{ project.description }}</p>
        <p><strong>Stack :</strong> {{ project.stack.join(', ') }}</p>
        <a :href="project.github" target="_blank" class="text-blue-500 underline">
          Voir sur GitHub
        </a>
        <div class="mt-3 flex gap-2">
          <button @click="editProject(project)">Modifier</button>
          <button @click="$emit('delete', project)">Supprimer</button>
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
  
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .visibility-badge {
    padding: 0.3rem 0.6rem;
    border-radius: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.85rem;
  }
  
  .visibility-badge.public {
    background-color: #42b983;
    color: white;
  }
  
  .visibility-badge.private {
    background-color: #e74c3c;
    color: white;
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
  