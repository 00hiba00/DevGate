<template>
  <div class="overlay">
    <form @submit.prevent="submitObjectif" class="form-card">
      <h2 class="title">{{ isEditMode ? "Modifier l'objectif" : 'Ajouter un objectif' }}</h2>

      <input v-model="title" type="text" placeholder="Titre de l'objectif" required class="input" />
      <input v-model="duree" type="text" placeholder="Durée" required class="input" />
      
      <!-- Progress Tracker -->
      <div class="field">
        <label>Progression : {{ progres }}%</label>
        <input v-model="progres" type="range" min="0" max="100" class="input range" />
      </div>

      <!-- Status Selector -->
      <div class="field">
        <label>Statut :</label>
        <select v-model="status" class="input select">
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
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
  addObjectifToFirestore,
  updateObjectifInFirestore
} from '@/composables/useFirestore'
import { getAuth } from 'firebase/auth';

const props = defineProps({
  initialObjectif: Object
})
const emit = defineEmits(['objectif-saved', 'close'])

const title = ref('')
const duree = ref('')
const progres = ref(0)
const status = ref('En cours')

const isEditMode = computed(() => !!props.initialObjectif)

watch(
  () => props.initialObjectif,
  (objectif) => {
    if (objectif) {
      title.value = objectif.title || ''
      duree.value = objectif.duree || ''
      progres.value = objectif.progres || 0
      status.value = objectif.status || 'En cours'
    }
  },
  { immediate: true }
)

// Automatic status update if progress is 100
watch(progres, (newValue) => {
  if (newValue >= 100) {
    status.value = 'Terminé'
  } else if (status.value === 'Terminé' && newValue < 100) {
    status.value = 'En cours'
  }
})

// Automatically set progres to 100 when status changes to 'Terminé'
watch(status, (newStatus) => {
  if (newStatus === 'Terminé') {
    progres.value = 100
  }
})

const submitObjectif = async () => {
  // Check if all fields are filled out
  if (!title.value || !duree.value || !progres.value || !status.value) {
    alert("Tous les champs doivent être remplis.");
    return;
  }

  // Ensure the user is logged in
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("Utilisateur non connecté.");
    return;
  }

  // Prepare the payload for the objectif
  const payload = {
    title: title.value,
    duree: duree.value,
    progres: progres.value,
    status: status.value,
    userId: user.uid,  // Include user ID for ownership tracking
    createdAt: new Date(),
  };

  // Check if we are in edit mode and update accordingly
  if (isEditMode.value) {
    await updateObjectifInFirestore(props.initialObjectif.id, payload);  // Update objectif with the provided ID
  } else {
    await addObjectifToFirestore({ ...payload, createdAt: new Date() });  // Add new objectif with the current date
  }

  // Emit the event after saving
  emit('objectif-saved');
};
</script>

<style scoped>
/* Overlay with semi-transparent background and blur effect */
.overlay {
  background: rgba(30, 27, 75, 0.6); /* Semi-transparent blue-violet */
  backdrop-filter: blur(6px); /* Blur effect */
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Form content with a dark indigo background */
.form-card {
  background: #1e1b4b; /* Dark indigo */
  color: #f9fafb; /* Almost white for contrast */
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Title styling with light violet color */
.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #a78bfa; /* Light violet */
  text-align: center;
}

/* Input fields with a dark indigo background and purple borders */
.input, .select {
  padding: 0.75rem;
  border: 1px solid #4c1d95; /* Dark violet border */
  background-color: #312e81; /* Dark indigo background */
  color: #f3f4f6; /* Light text */
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
}

.input::placeholder {
  color: #c4b5fd; /* Pale violet for placeholder text */
}

.input:focus, .select:focus {
  outline: none;
  border-color: #a78bfa; /* Light violet on focus */
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
}

/* Range input with violet color */
.range {
  background-color: #444;
  color: #fff;
}

/* Label styling with a light color */
label {
  color: #c4b5fd; /* Light violet for labels */
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* Action buttons aligned at the bottom */
.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Button styling */
.btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: bold;
  background: #7c3aed; /* Bright violet */
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #6d28d9; /* Darker violet on hover */
}

/* Cancel button with a darker gray background */
.btn.cancel {
  background: #6b7280; /* Dark gray */
}

.btn.cancel:hover {
  background: #4b5563; /* Darker gray on hover */
}

</style>
