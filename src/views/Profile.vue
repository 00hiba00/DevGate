<template>
    <div class="profile-container" v-if="user">
    <div class="avatar-wrapper">
  <img v-if="user.photoURL" :src="user.photoURL" alt="Photo de profil" class="profile-avatar" />
  <div v-else class="default-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
</div>

      <h2>Profil de {{ user.name }}</h2>
      <div class="user-info">
        <p><strong>Email :</strong> {{ user.email }}</p>
      </div>
  
      <div class="section">
        <h3>Projets publics</h3>
        <div v-if="publicProjects.length">
          <ul>
            <li v-for="project in publicProjects" :key="project.id" class="project-item">
        <h4>{{ project.title }}</h4>
        <p><strong>Description :</strong> {{ project.description }}</p>
        <p><strong>GitHub :</strong> <a :href="project.github" target="_blank">{{ project.github }}</a></p>
        <p><strong>Stack :</strong> {{ project.stack.join(', ') }}</p> <!-- Si 'stack' est un tableau -->
      </li>
          </ul>
        </div>
        <div v-else>
          Aucun projet public.
        </div>
      </div>
  
      <div class="section">
        <h3>Compétences</h3>
        <div v-if="competences.length">
          <ul>
            <li v-for="competence in competences" :key="competence.id" class="competence-item">
  <h4>{{ competence.name }}</h4>
  <p><strong>Niveau :</strong> {{ competence.level }}</p>
  <p><strong>Date d'acquisition :</strong> {{ formatDate(competence.acquisitionDate) }}</p>
  <p><strong>Date de progression :</strong> {{ formatDate(competence.progressionDate) }}</p>
</li>

          </ul>
        </div>
        <div v-else>
          Aucune compétence.
        </div>
      </div>
    </div>
  
    <div v-else class="loading">
      Chargement du profil...
    </div>
    <button @click="$router.back()" class="back-btn">← Retour</button>

  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { db } from '@/firebase/firebase'
  import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
  
  const route = useRoute()
  const userId = route.params.userId
  
  const user = ref(null)
  const publicProjects = ref([])
  const competences = ref([])
  
  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        user.value = userDoc.data()
      } else {
        console.error('Utilisateur non trouvé.')
      }
    } catch (error) {
      console.error('Erreur en récupérant l\'utilisateur :', error)
    }
  }
  
  const fetchPublicProjects = async () => {
  try {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      where('visibility', '==', 'public') // <-- ici
    )
    const querySnapshot = await getDocs(q)
    publicProjects.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Erreur en récupérant les projets publics :', error)
  }
}

  
const fetchCompetences = async () => {
  try {
    const q = query(
      collection(db, 'competences'),
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    competences.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    console.log('Compétences récupérées :', competences.value)  // <<< ajoute ça
  } catch (error) {
    console.error('Erreur en récupérant les compétences :', error)
  }
}
  
  onMounted(async () => {
    await fetchUserData()
    await fetchPublicProjects()
    await fetchCompetences()
  })
  const formatDate = (date) => {
  if (!date) return 'Non spécifiée';

  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  if (date.seconds) {
    return new Date(date.seconds * 1000).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return 'Format de date inconnu';
}

  
  

  
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .user-info, .section {
    margin-bottom: 2rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .loading {
    text-align: center;
    margin-top: 5rem;
  }
  .profile-avatar, .default-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(45deg, #FF9A9E, #FAD0C4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.back-btn {
  background: none;
  border: none;
  color: #42b983;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

  </style>
  