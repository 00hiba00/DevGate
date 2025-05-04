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

        <!-- Bouton d'ajout qui affiche l'input pour ajouter une technologie -->
        <div v-if="!isInputVisible" class="flex items-center gap-2 mt-2">
          <button type="button" @click="toggleInputVisibility" class="btn btn-small">Ajouter</button>
        </div>

        <!-- Input pour ajouter une nouvelle technologie -->
        <div v-if="isInputVisible" class="flex items-center gap-2 mt-2">
          <input v-model="newTech" type="text" placeholder="Ajouter une technologie" class="input input-small" />
          <button type="button" @click="addTech" class="btn btn-small">Valider</button>
        </div>
      </div>

      <label class="label">Visibilité du projet :</label>
      <div class="flex gap-4">
        <label>
          <input type="radio" v-model="visibility" value="public" /> Public
        </label>
        <label>
          <input type="radio" v-model="visibility" value="private" /> Privé
        </label>
      </div>

      <div class="actions">
        <button type="submit" class="btn">{{ isEditMode ? 'Modifier' : 'Ajouter' }}</button>
        <button type="button" class="btn cancel" @click="$emit('close')">Annuler</button>

        <!-- Bouton supprimer avec confirmation -->
        
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  addProjectToFirestore,
  updateProjectInFirestore,
  getProjects,
  deleteProjectFromFirestore
} from '@/composables/useFirestore'
import { getAuth } from 'firebase/auth'

const props = defineProps({
  initialProject: Object
})
const emit = defineEmits(['project-saved', 'close'])

const title = ref('')
const description = ref('')
const github = ref('')
const stack = ref([])
const visibility = ref('public')
const newTech = ref('')  // Nouvel input pour ajouter une technologie
const isInputVisible = ref(false)  // Variable pour gérer l'affichage de l'input
const techList = ref(['Vue.js', 'React', 'Node.js', 'Firebase', 'Python', 'Laravel']) // techList devient une ref

const isEditMode = computed(() => !!props.initialProject)

watch(
  () => props.initialProject,
  (project) => {
    if (project) {
      title.value = project.title || ''
      description.value = project.description || ''
      github.value = project.github || ''
      stack.value = project.stack || []
      visibility.value = project.visibility || 'public'
    }
  },
  { immediate: true }
)

const toggleInputVisibility = () => {
  isInputVisible.value = true; // Afficher l'input pour ajouter une technologie
}

const addTech = () => {
  const tech = newTech.value.trim()
  if (tech && !techList.value.includes(tech)) {
    techList.value.push(tech)  // Ajouter la nouvelle technologie à la liste
    stack.value.push(tech)  // La nouvelle technologie doit être cochée
    newTech.value = ''  // Réinitialiser l'input
    isInputVisible.value = false; // Cacher l'input après ajout
  }
}



const deleteProject = async () => {
  // Appel à la fonction pour supprimer le projet de Firestore
  if (props.initialProject.id) {
    await deleteProjectFromFirestore(props.initialProject.id);
    emit('project-saved'); // Émettre l'événement après suppression
    emit('close'); // Fermer le formulaire
  }
};

const submitProject = async () => {
  if (!title.value || !description.value || !github.value || stack.value.length === 0) {
    alert("Tous les champs doivent être remplis.");
    return;
  }

  const existingProjects = await getProjects();
  const isTitleTaken = existingProjects.some(project => project.title.toLowerCase() === title.value.toLowerCase());

  if (isTitleTaken && !isEditMode.value) {
    alert("Ce projet existe déjà. Veuillez choisir un autre titre.");
    return;
  }

  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    alert("Utilisateur non connecté.");
    return;
  }

  const payload = {
    title: title.value,
    description: description.value,
    github: github.value,
    stack: stack.value,
    visibility: visibility.value,
    userId: user.uid,
    createdAt: new Date()
  };

  if (isEditMode.value) {
    await updateProjectInFirestore(props.initialProject.id, payload);
  } else {
    await addProjectToFirestore(payload);
  }

  emit('project-saved');
};
</script>

<style scoped>
/* Fond de la modale */
.overlay {
  background: rgba(30, 27, 75, 0.6); /* Bleu-violet semi-transparent */
  backdrop-filter: blur(6px);
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Carte du formulaire */
.form-card {
  background: #1e1b4b; /* Indigo très foncé */
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Titre du formulaire */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #a78bfa; /* Violet clair */
  text-align: center;
}

/* Inputs et textarea */
.input,
.textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #4c1d95;
  background-color: #312e81;
  color: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.input::placeholder,
.textarea::placeholder {
  color: #c4b5fd;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
}

/* Petite taille pour input */
.input-small {
  width: 80%;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Labels */
.label {
  font-weight: bold;
  color: #c4b5fd;
}

/* Boutons */
.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: bold;
  background: #7c3aed; /* Violet vif */
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #6d28d9;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

/* Annuler */
.cancel {
  background: #6b7280;
}

.cancel:hover {
  background: #4b5563;
}

/* Supprimer */
.delete {
  background: #ef4444;
}

.delete:hover {
  background: #dc2626;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* Flex utilitaires */
.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

</style>
