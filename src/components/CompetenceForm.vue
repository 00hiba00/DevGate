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
  
  .input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.75rem;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
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
  .competence-form-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
  </style>