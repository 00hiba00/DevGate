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
        v-for="user in sortedUsers" 
        :key="user.id" 
        :user="user" 
        :is-following="isFollowing(user.id)"
        @view-profile="handleViewProfile"
        @follow="followUser"
        @unfollow="unfollowUser"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import ajouté
import UserItem from './UserItem.vue';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const router = useRouter(); // Initialisation du router
const auth = getAuth();
const currentUserId = auth.currentUser?.uid;
const searchQuery = ref('');
const users = ref([]);
const following = ref([]);

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    users.value = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== currentUserId);
  } catch (error) {
    console.error('Erreur en récupérant les utilisateurs :', error);
  }
};

const fetchFollowing = () => {
  if (!currentUserId) return;
  
  const followingRef = collection(db, `users/${currentUserId}/following`);
  return onSnapshot(followingRef, (snapshot) => {
    following.value = snapshot.docs.map(doc => doc.id);
  });
};

const isFollowing = (userId) => {
  return following.value.includes(userId);
};

const followUser = async (userId) => {
  if (!currentUserId) return;
  
  try {
    const followRef = doc(db, `users/${currentUserId}/following`, userId);
    await setDoc(followRef, { timestamp: new Date() });
  } catch (error) {
    console.error('Error following user:', error);
  }
};

const unfollowUser = async (userId) => {
  if (!currentUserId) return;
  
  try {
    const followRef = doc(db, `users/${currentUserId}/following`, userId);
    await deleteDoc(followRef);
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
};

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

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    const aIsFollowing = isFollowing(a.id);
    const bIsFollowing = isFollowing(b.id);
    
    if (aIsFollowing && !bIsFollowing) return -1;
    if (!aIsFollowing && bIsFollowing) return 1;
    return 0;
  });
});

const handleViewProfile = (user) => {
  router.push(`/profile/${user.id}`);
};

onMounted(() => {
  fetchUsers();
  fetchFollowing();
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