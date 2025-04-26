<template>
    <div class="overlay">
      <form @submit.prevent="submitObjectif" class="form-card">
        <h2 class="title">{{ isEditMode ? "Modifier l'objectif" : 'Ajouter un objectif' }}</h2>
  
        <input v-model="title" type="text" placeholder="Titre de l'objectif" required class="input" />
        <input v-model="duree" type="text" placeholder="Durée" required class="input" />
        
        <!-- Progress Tracker -->
        <div class="field">
          <label>Progression : {{ progres }}%</label>
          <input v-model="progres" type="range" min="0" max="100" class="input" />
        </div>
  
        <!-- Status Selector -->
        <div class="field">
          <label>Statut :</label>
          <select v-model="status" class="input">
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
  /* Ton style reste nickel */
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
  
  .input, .textarea, select {
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
  
  .field {
    margin-bottom: 1rem;
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
  