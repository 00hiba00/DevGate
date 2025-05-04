<template>
    <div class="competence-form-modal">
        <form @submit.prevent="submitCompetence" class="form-content">
        <h2 class="title">{{ initialCompetence ? 'Modifier la compétence' : 'Ajouter une compétence' }}</h2>
  
        <input v-model="name" type="text" placeholder="Nom de la compétence" required class="input" />
        
        <select v-model="level" required class="input">
  <option value="" disabled>Niveau</option>
  <option value="Débutant">Débutant</option>
  <option value="Intermédiaire">Intermédiaire</option>
  <option value="Avancé">Avancé</option>
</select>

        <p>Date d'acquisition</p>
        <input v-model="acquisitionDate" type="date" placeholder="Date d'acquisition" class="input" />
        <p>Date de progression</p>
        <input v-model="progressionDate" type="date" placeholder="Date de progression" class="input" />

        <div class="actions">
          <button type="submit" class="btn">{{ initialCompetence ? 'Modifier' : 'Ajouter' }}</button>
          <button type="button" class="btn cancel" @click="cancel">Annuler</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
import { ref, watch } from 'vue';
import { addCompetenceToFirestore, updateCompetenceInFirestore } from '@/composables/useFirestore';
import { getAuth } from 'firebase/auth'; // <-- import Firebase Auth

const props = defineProps({
  initialCompetence: Object,
});

const emit = defineEmits(['competence-saved', 'close']);

const name = ref(props.initialCompetence ? props.initialCompetence.name : '');
const level = ref(props.initialCompetence ? props.initialCompetence.level : '');
const acquisitionDate = ref(props.initialCompetence ? props.initialCompetence.acquisitionDate : '');
const progressionDate = ref(props.initialCompetence ? props.initialCompetence.progressionDate : '');

watch(
  () => props.initialCompetence,
  (competence) => {
    if (competence) {
      name.value = competence.name || '';
      level.value = competence.level || '';
      acquisitionDate.value = competence.acquisitionDate || '';
      progressionDate.value = competence.progressionDate || '';
    }
  },
  { immediate: true }
);

const submitCompetence = async () => {
  const payload = {
    name: name.value,
    level: level.value,
    acquisitionDate: acquisitionDate.value,
    progressionDate: progressionDate.value,
  };

  if (props.initialCompetence) {
    await updateCompetenceInFirestore(props.initialCompetence.id, payload);
  } else {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error("Utilisateur non connecté");
      return;
    }
    await addCompetenceToFirestore({
      ...payload,
      userId: user.uid   // <-- ajouter userId lors de l'ajout
    });
  }
  
  emit('competence-saved');
  emit('close');
};

const cancel = () => {
  emit('close');
};
</script>

  <style scoped>
  .competence-form-modal {
  background: rgba(30, 27, 75, 0.6); /* Fond semi-transparent bleu-violet */
  backdrop-filter: blur(6px);
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-content {
  background: #1e1b4b; /* Indigo très foncé */
  color: #f9fafb; /* Presque blanc pour contraste */
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #a78bfa; /* Violet clair */
  text-align: center;
}

.input {
  padding: 0.75rem;
  border: 1px solid #4c1d95; /* Bordure violet foncé */
  background-color: #312e81; /* Indigo foncé */
  color: #f3f4f6; /* Texte clair */
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
}

.input::placeholder {
  color: #c4b5fd; /* Placeholder violet pâle */
}

.input:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3);
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

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
  background: #6d28d9; /* Violet plus foncé */
}

.btn.cancel {
  background: #6b7280; /* Gris foncé */
}

.btn.cancel:hover {
  background: #4b5563;
}


  </style>
