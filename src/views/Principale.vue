<template>
  <div>
    <button @click="viewMyProfile" class="btn profile-btn">
      Voir mon profil
    </button>
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
      <h2>Réseau</h2>
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

const viewMyProfile = () => {
  router.push('/my-profile');
};
onMounted(() => {
  fetchProjects()
  fetchCompetences()
  fetchObjectifs()
  fetchFollowing() // NEW: Initialize follow system
  fetchFollowers() // NEW: Initialize follow system
})
</script>

<style scoped>
/* All your existing styles remain exactly the same */
div {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.project-form),
:deep(.competence-form),
:deep(.view-toggle) {
  margin-bottom: 2rem;
}

:deep(.project-list.grid),
:deep(.competence-list.grid) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

:deep(.project-list.list),
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

/* NEW STYLES ONLY FOR FOLLOW SECTION */
.connections-section {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.connections-container {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.connections-column {
  flex: 1;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.connections-column h3 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.connection-item {
  padding: 0.8rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.empty-connections {
  color: #888;
  font-style: italic;
  padding: 1rem 0;
}
</style>