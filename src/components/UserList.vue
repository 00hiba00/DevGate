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
  padding: 2rem;
  background-color: #1a1a1d;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(98, 0, 234, 0.2);
  color: #f1f1f1;
}

.search-bar {
  margin-bottom: 2rem;
}

.b-input-group {
  max-width: 500px;
  margin: 0 auto;
}

.b-form-input {
  background-color: #2b2b30;
  border: 1px solid #444;
  color: #eaeaea;
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.b-form-input::placeholder {
  color: #a8a8a8;
}

.b-form-input:focus {
  border-color:rgb(46, 7, 204);
  box-shadow: 0 0 5px rgba(50, 7, 221, 0.7);
  outline: none;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #bbbbbb;
}

.b-alert {
  border-radius: 10px;
  background-color: #2d2d32;
  color: #e0e0e0;
  font-size: 1.1rem;
  padding: 1.2rem;
  border: 1px solidrgb(34, 9, 134);
  box-shadow: 0 0 10px rgba(40, 7, 170, 0.3);
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

</style>