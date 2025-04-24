<template>
    <form @submit.prevent="submitCompetence" class="space-y-4">
      <input v-model="name" type="text" placeholder="Nom de la compétence" required class="input" />
      <select v-model="level" required class="input">
        <option value="" disabled selected>Niveau</option>
        <option value="Débutant">Débutant</option>
        <option value="Intermédiaire">Intermédiaire</option>
        <option value="Avancé">Avancé</option>
      </select>
      <input v-model="acquisitionDate" type="date" placeholder="Date d'acquisition" class="input" />
      
      <button type="submit" class="btn">Sauvegarder</button>
      <button @click="cancel" type="button" class="btn-danger">Annuler</button>
    </form>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { addCompetenceToFirestore, updateCompetenceInFirestore } from '@/composables/useFirestore';
  
  const props = defineProps({
    initialCompetence: Object,
  });
  
  const emit = defineEmits(['competence-saved', 'close']);
  
  const name = ref(props.initialCompetence ? props.initialCompetence.name : '');
  const level = ref(props.initialCompetence ? props.initialCompetence.level : '');
  const acquisitionDate = ref(props.initialCompetence ? props.initialCompetence.acquisitionDate : '');
  
  const submitCompetence = async () => {
    if (props.initialCompetence) {
      await updateCompetenceInFirestore(props.initialCompetence.id, { name: name.value, level: level.value, acquisitionDate: acquisitionDate.value });
    } else {
      await addCompetenceToFirestore({ name: name.value, level: level.value, acquisitionDate: acquisitionDate.value });
    }
    emit('competence-saved');
    emit('close');
  };
  
  const cancel = () => {
    emit('close');
  };
  </script>
  
  
  
  <style scoped>
  .input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.75rem;
    font-size: 1rem;
    margin-bottom: 1rem;
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
    margin-right: 1rem;
  }
  
  .btn:hover {
    background-color: #36976f;
  }
  
  .btn-cancel {
    background-color: #e3342f;
  }
  
  .btn-cancel:hover {
    background-color: #cc1f1a;
  }
  </style>
  