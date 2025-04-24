<template>
    <div class="overlay">
      <form @submit.prevent="submitProject" class="form-card">
        <h2 class="title">{{ isEditMode ? 'Modifier le projet' : 'Ajouter un projet' }}</h2>
  
        <input v-model="title" type="text" placeholder="Titre du projet" required class="input" />
        <textarea v-model="description" placeholder="Description du projet" required class="textarea" />
        <input v-model="github" type="url" placeholder="Lien GitHub" class="input" />
  
        <label class="label">Stack utilisée :</label>
        <div class="flex flex-wrap gap-2">
          <label v-for="tech in techList" :key="tech" class="flex items-center gap-1">
            <input type="checkbox" :value="tech" v-model="stack" />
            {{ tech }}
          </label>
        </div>
  
        <div class="actions">
          <button type="submit" class="btn">{{ isEditMode ? 'Modifier' : 'Ajouter' }}</button>
          <button type="button" class="btn cancel" @click="$emit('close')">Annuler</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import {
    addProjectToFirestore,
    updateProjectInFirestore
  } from '@/composables/useFirestore'
  
  const props = defineProps({
    initialProject: Object
  })
  const emit = defineEmits(['project-saved', 'close'])
  
  const title = ref('')
  const description = ref('')
  const github = ref('')
  const stack = ref([])
  const techList = ['Vue.js', 'React', 'Node.js', 'Firebase', 'Python', 'Laravel']
  
  const isEditMode = computed(() => !!props.initialProject)
  
  watch(
    () => props.initialProject,
    (project) => {
      if (project) {
        title.value = project.title || ''
        description.value = project.description || ''
        github.value = project.github || ''
        stack.value = project.stack || []
      }
    },
    { immediate: true }
  )
  
  const submitProject = async () => {
    const payload = {
      title: title.value,
      description: description.value,
      github: github.value,
      stack: stack.value
    }
  
    if (isEditMode.value) {
      await updateProjectInFirestore(props.initialProject.id, payload)
    } else {
      await addProjectToFirestore({ ...payload, createdAt: new Date() })
    }
  
    emit('project-saved')
  }
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .form-card {
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .input, .textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.75rem;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .label {
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .btn {
    padding: 0.6rem 1.2rem;
    border-radius: 0.75rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: #42b983;
    color: white;
    margin-right: 0.5rem;
  }
  
  .cancel {
    background: #ccc;
    color: #333;
  }
  
  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  </style>
  