<template>
  <div class="user-list-container">
    
    <b-input-group class="search-bar">
      <b-form-input 
        v-model="searchQuery" 
        placeholder="Rechercher un utilisateur..." 
      />
    </b-input-group>

    <div v-if="users.length === 0" class="empty-state">
      <b-alert show variant="info">Aucun utilisateur trouvé.</b-alert>
    </div>

    <div v-else class="user-grid">
      <UserItem 
        v-for="user in filteredUsers" 
        :key="user.id" 
        :user="user" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import UserItem from './UserItem.vue';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const searchQuery = ref('');
const users = ref([]);

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (d.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  return filtered;
});

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.value = querySnapshot.docs.map(doc => 
      ({uid: doc.id, ...doc.data()})
    );
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
<style scoped>
.user-list-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 2rem;
}

.b-input-group {
  max-width: 500px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.b-button {
  margin-bottom: 1.5rem;
  padding: 0.75rem 2rem;
  background: #007bff;
  border: none;
  color: white;
  border-radius: 50px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.b-button:hover {
  background: #0056b3;
}

.b-alert {
  border-radius: 8px;
  font-size: 1.1rem;
  padding: 1.25rem;
  margin-top: 1rem;
}
</style>
