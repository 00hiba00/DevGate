<template>
  <div>
    
    <!-- All your existing template code remains untouched -->
    <ProjectForm 
      v-if="isEditingProject || isAddingProject" 
      :initialProject="currentProject" 
      @project-saved="fetchProjectsAndCloseForm" 
      @close="closeProjectForm"
    />
    
    <div v-if="isEditingCompetence || isAddingCompetence" class="modal-overlay">
      <CompetenceForm 
        :initialCompetence="currentCompetence" 
        @competence-saved="fetchCompetencesAndCloseForm" 
        @close="closeCompetenceForm"
      />
    </div>

    <ObjectifForm 
      v-if="isEditingObjectif || isAddingObjectif" 
      :initialObjectif="currentObjectif" 
      @objectif-saved="fetchObjectifsAndCloseForm" 
      @close="closeObjectifForm"
    />
    
    <ViewToggle @toggle="viewMode = $event" :current="viewMode" />
    
    <button @click="startAddingProject" class="btn">
      Ajouter un projet
    </button>
    
    <ProjectList
      :projects="projects"
      :viewMode="viewMode"
      @delete="deleteProject"
      @edit="editProject"
    />
    
    <button @click="startAddingCompetence" class="btn">
      Ajouter une compétence
    </button>
    
    <CompetenceList
      :competences="competences"
      :viewMode="viewMode"
      @delete="deleteCompetence"
      @edit="editCompetence"
    />
    
    <button @click="startAddingObjectif" class="btn">
      Ajouter un objectif
    </button>
    
    <ObjectifList
      :objectifs="objectifs"
      :viewMode="viewMode"
      @delete="deleteObjectif"
      @edit="editObjectif"
    />

    <!-- NEW FOLLOW SECTION ADDED AT THE BOTTOM -->
    <div class="connections-section">
      <h2 >Réseau</h2>
      <div class="connections-container">
        <div class="connections-column">
          <h3>Abonnements</h3>
          <div v-if="following.length > 0" class="connections-list">
            <div v-for="user in following" :key="user.id" class="connection-item">
              <span>{{ user.name }}</span>
            </div>
          </div>
          <div v-else class="empty-connections">
            <p>Vous ne suivez personne</p>
          </div>
        </div>
        <div class="connections-column">
          <h3>Abonnés</h3>
          <div v-if="followers.length > 0" class="connections-list">
            <div v-for="user in followers" :key="user.id" class="connection-item">
              <span>{{ user.name }}</span>
            </div>
          </div>
          <div v-else class="empty-connections">
            <p>Vous n'avez pas d'abonnés</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// All your existing imports remain the same
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/firebase'
import { 
  getProjects, 
  deleteProjectFromFirestore, 
  getCompetences, 
  deleteCompetenceFromFirestore, 
  getObjectifs, 
  deleteObjectifFromFirestore 
} from '@/composables/useFirestore'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectList from '@/components/ProjectList.vue'
import ViewToggle from '@/components/ViewToggle.vue'
import CompetenceForm from '@/components/CompetenceForm.vue'
import CompetenceList from '@/components/CompetenceList.vue'
import ObjectifForm from '@/components/ObjectifForm.vue'
import ObjectifList from '@/components/ObjectifList.vue'

import { useRouter } from 'vue-router';

const router = useRouter();
// All your existing refs remain the same
const projects = ref([])
const competences = ref([])
const objectifs = ref([])
const viewMode = ref('grid')
const isEditingProject = ref(false)
const isAddingProject = ref(false)
const isEditingCompetence = ref(false)
const isAddingCompetence = ref(false)
const currentProject = ref(null)
const currentCompetence = ref(null)
const isEditingObjectif = ref(false)
const isAddingObjectif = ref(false)
const currentObjectif = ref(null)

// NEW FOLLOW-RELATED CODE
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const auth = getAuth()
const currentUserId = auth.currentUser?.uid
const following = ref([])
const followers = ref([])

const fetchFollowing = () => {
  if (!currentUserId) return
  
  const followingRef = collection(db, `users/${currentUserId}/following`)
  return onSnapshot(followingRef, async (snapshot) => {
    const followingIds = snapshot.docs.map(doc => doc.id)
    if (followingIds.length > 0) {
      const q = query(collection(db, 'users'), where('__name__', 'in', followingIds))
      const querySnapshot = await getDocs(q)
      following.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } else {
      following.value = []
    }
  })
}

const fetchFollowers = () => {
  if (!currentUserId) return
  
  const followersRef = collection(db, `users/${currentUserId}/followers`)
  return onSnapshot(followersRef, async (snapshot) => {
    const followerIds = snapshot.docs.map(doc => doc.id)
    if (followerIds.length > 0) {
      const q = query(collection(db, 'users'), where('__name__', 'in', followerIds))
      const querySnapshot = await getDocs(q)
      followers.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } else {
      followers.value = []
    }
  })
}

// All your existing methods remain exactly the same
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
  closeProjectForm()
}

const fetchCompetencesAndCloseForm = async () => {
  await fetchCompetences()
  closeCompetenceForm()
}

const fetchObjectifsAndCloseForm = async () => {
  await fetchObjectifs()
  closeObjectifForm()
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
  currentProject.value = null
}

const startAddingCompetence = () => {
  isAddingCompetence.value = true
  isEditingCompetence.value = false
  currentCompetence.value = null
}

const startAddingObjectif = () => {
  isAddingObjectif.value = true
  isEditingObjectif.value = false
  currentObjectif.value = null
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
  fetchFollowing() // NEW: Initialize follow system
  fetchFollowers() // NEW: Initialize follow system
})
</script>

<style scoped>
body {
  background-color: #1e1e2e;
}

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
  background-color: #6a5bff; /* Blue-violet */
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  font-size: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  align-self: flex-start;
  margin-bottom: 1rem;
}

.btn:hover {
  background-color: #4e45cc; /* Darker blue-violet */
  transform: scale(1.05); /* Slight scaling effect on hover */
}

/* Focus effect for accessibility */
.btn:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(106, 91, 255, 0.7);
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.connections-section {
  margin-top: 3rem;
  background-color: #2b2b3c;
  padding: 2rem;
  border-radius: 1rem;
  color: white;
  box-shadow: 0 0 10px rgba(106, 91, 255, 0.2);
}

.connections-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #a99fff;
  text-align: center;
}

.connections-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.connections-column {
  background-color: #1e1e2e;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 6px rgba(106, 91, 255, 0.15);
}

.connections-column h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #d0c8ff;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.connection-item {
  background-color: #2f2f44;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  transition: background-color 0.2s ease;
}

.connection-item:hover {
  background-color: #4e45cc;
}

.empty-connections {
  font-style: italic;
  color: #aaa;
  padding: 0.5rem;
}


</style>
