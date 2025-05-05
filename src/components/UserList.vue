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
/* User List Container */
.user-list-container {
  padding: 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  color: var(--text-color, #e0e0e0);
}

/* Search Bar */
.search-bar {
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar input {
  background-color: #2a2a3d;
  color: #e0e0e0;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
}

.search-bar input::placeholder {
  color: #a6a6c3;
}

/* Empty State */
.empty-state {
  text-align: center;
  margin-top: 2rem;
}

.empty-state .alert {
  background-color: #2f2f44;
  color: #ccc;
  border: none;
  border-radius: 6px;
}

/* User Grid */
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Optional: Transitions */
.user-grid > * {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.user-grid > *:hover {
  transform: translateY(-5px);
  opacity: 0.95;
}

</style>
