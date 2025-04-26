<template>
    <div>
      <!-- Affichage du formulaire dans une fenêtre modale (ajout ou modification d'un projet) -->
      <ProjectForm 
        v-if="isEditingProject || isAddingProject" 
        :initialProject="currentProject" 
        @project-saved="fetchProjectsAndCloseForm" 
        @close="closeProjectForm"
      />
      
      <!-- Affichage du formulaire dans une fenêtre modale (ajout ou modification d'une compétence) -->
      <CompetenceForm 
        v-if="isEditingCompetence || isAddingCompetence" 
        :initialCompetence="currentCompetence" 
        @competence-saved="fetchCompetencesAndCloseForm" 
        @close="closeCompetenceForm"
      />

      <ObjectifForm 
        v-if="isEditingObjectif || isAddingObjectif" 
        :initialObjectif="currentObjectif" 
        @objectif-saved="fetchObjectifsAndCloseForm" 
        @close="closeObjectifForm"
      />
      
      <!-- Vue toggle pour choisir entre grille et liste -->
      <ViewToggle @toggle="viewMode = $event" :current="viewMode" />
      
      <!-- Bouton pour ajouter un projet -->
      <button @click="startAddingProject" class="btn">
        Ajouter un projet
      </button>
      
      <!-- Liste des projets -->
      <ProjectList
        :projects="projects"
        :viewMode="viewMode"
        @delete="deleteProject"
        @edit="editProject"
      />
      
      <!-- Bouton pour ajouter une compétence -->
      <button @click="startAddingCompetence" class="btn">
        Ajouter une compétence
      </button>
      
      <!-- Liste des compétences -->
      <CompetenceList
        :competences="competences"
        :viewMode="viewMode"
        @delete="deleteCompetence"
        @edit="editCompetence"
      />

      <button @click="startAddingObjectif" class="btn">
        Ajouter un objectif
      </button>
      
      <!-- Liste des projets -->
      <ObjectifList
        :objectifs="objectifs"
        :viewMode="viewMode"
        @delete="deleteObjectif"
        @edit="editObjectif"
      />

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getProjects, deleteProjectFromFirestore, getCompetences, deleteCompetenceFromFirestore, getObjectifs, deleteObjectifFromFirestore } from '@/composables/useFirestore'
  import ProjectForm from '@/components/ProjectForm.vue'
  import ProjectList from '@/components/ProjectList.vue'
  import ViewToggle from '@/components/ViewToggle.vue'
  import CompetenceForm from '@/components/CompetenceForm.vue'
  import CompetenceList from '@/components/CompetenceList.vue'
  import ObjectifForm from '@/components/ObjectifForm.vue'
  import ObjectifList from '@/components/ObjectifList.vue'

  
  const projects = ref([])
  const competences = ref([]) // Liste des compétences
  const objectifs = ref([])
  const viewMode = ref('grid') // ou 'list'
  const isEditingProject = ref(false)
  const isAddingProject = ref(false)
  const isEditingCompetence = ref(false)
  const isAddingCompetence = ref(false) // Nouveau flag pour l'ajout d'une compétence
  const currentProject = ref(null)
  const currentCompetence = ref(null)
  const isEditingObjectif = ref(false)
  const isAddingObjectif = ref(false)
  const currentObjectif = ref(null)
  
  const fetchProjects = async () => {
    projects.value = await getProjects()
  }
  
  const fetchCompetences = async () => {
    competences.value = await getCompetences()
  }

  const fetchObjectifs = async () => {
    objectifs.value = await getObjectifs()
  }
  
  const fetchProjectsAndCloseForm = async () => {
    await fetchProjects()
    closeProjectForm() // Ferme le formulaire après l'ajout ou la modification d'un projet
  }
  
  const fetchCompetencesAndCloseForm = async () => {
    await fetchCompetences()
    closeCompetenceForm() // Ferme le formulaire après l'ajout ou la modification d'une compétence
  }

  const fetchObjectifsAndCloseForm = async () => {
    await fetchObjectifs()
    closeObjectifForm() // Ferme le formulaire après l'ajout ou la modification d'un projet
  }
  
  const deleteProject = async (id) => {
    await deleteProjectFromFirestore(id)
    await fetchProjects()
  }
  
  const deleteCompetence = async (id) => {
    await deleteCompetenceFromFirestore(id)
    await fetchCompetences()
  }

  const deleteObjectif = async (id) => {
    await deleteObjectifFromFirestore(id)
    await fetchObjectifs()
  }
  
  const editProject = (project) => {
    currentProject.value = project
    isEditingProject.value = true
    isAddingProject.value = false
  }
  
  const editCompetence = (competence) => {
    currentCompetence.value = competence
    isEditingCompetence.value = true
    isAddingCompetence.value = false
  }

  const editObjectif = (objectif) => {
    currentObjectif.value = objectif
    isEditingObjectif.value = true
    isAddingObjectif.value = false
  }
  
  const startAddingProject = () => {
    isAddingProject.value = true
    isEditingProject.value = false
    currentProject.value = null // Réinitialiser les données du projet
  }
  
  const startAddingCompetence = () => {
    isAddingCompetence.value = true
    isEditingCompetence.value = false
    currentCompetence.value = null // Réinitialiser les données de la compétence
  }

  const startAddingObjectif = () => {
    isAddingObjectif.value = true
    isEditingObjectif.value = false
    currentObjectif.value = null // Réinitialiser les données du projet
  }
  
  const closeProjectForm = () => {
    isEditingProject.value = false
    isAddingProject.value = false
    currentProject.value = null
  }
  
  const closeCompetenceForm = () => {
    isEditingCompetence.value = false
    isAddingCompetence.value = false
    currentCompetence.value = null
  }

  const closeObjectifForm = () => {
    isEditingObjectif.value = false
    isAddingObjectif.value = false
    currentObjectif.value = null
  }
  
  onMounted(() => {
    fetchProjects()
    fetchCompetences()
    fetchObjectifs()
  })
  </script>
  
  <style scoped>
  /* Base container */
  div {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* ProjectForm, CompetenceForm and ViewToggle spacing */
  :deep(.project-form),
  :deep(.competence-form),
  :deep(.view-toggle) {
    margin-bottom: 2rem;
  }
  
  /* Project list grid layout */
  :deep(.project-list.grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  /* List view styling */
  :deep(.project-list.list) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Competence list grid layout */
  :deep(.competence-list.grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  /* List view styling */
  :deep(.competence-list.list) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    background-color: #42b983;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    font-size: 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    align-self: flex-start;
    margin-bottom: 1rem;
  }
  
  .btn:hover {
    background-color: #36976f;
  }
  </style>
  