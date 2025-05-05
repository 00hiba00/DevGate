<template>
  <div class="user-card">
   
    <div class="user-avatar">
  <img
    v-if="user.photoURL"
    :src="user.photoURL"
    alt="User Avatar"
    class="avatar-image"
  >
  <span v-else>
    {{ user.name.charAt(0).toUpperCase() }}
  </span>
</div>

   
    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <p class="user-email">{{ user.email }}</p>
    </div>
   
    <div class="user-actions">
      <!-- Bouton original "Voir le profil" - Fonctionnel -->
      <button
        class="connect-btn"
        @click="$emit('view-profile', user)"
      >
        Voir le profil
      </button>
     
      <!-- Nouveaux boutons de suivi ajoutés en dessous -->
      <button
        v-if="!isFollowing"
        @click.stop="$emit('follow', user.id)"
        class="follow-btn"
      >
        Suivre
      </button>
      <button
        v-else
        @click.stop="$emit('unfollow', user.id)"
        class="unfollow-btn"
      >
        Suivi
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  isFollowing: {
    type: Boolean,
    default: false
  }
});

defineEmits(['view-profile', 'follow', 'unfollow']);
</script>

<style scoped>
/* Container for each user card */
.user-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 1rem;
  padding: 1.2rem;
  background-color: var(--card-background, #1f1f2e);
  color: var(--text-color, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Avatar */
.user-avatar {
  background-color: #5e4b8b;
  color: white;
  width: 64px;
  height: 64px;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 0.8rem;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* User information */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.user-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #b3a0ff;
  margin: 0;
}

.user-email {
  font-size: 0.9rem;
  color: #cccccc;
  margin: 0.3rem 0 0;
}

/* Action buttons */
.user-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

/* Shared button styles */
.user-actions button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
}

/* View Profile Button */
.connect-btn {
  background-color: #5e4b8b;
}

.connect-btn:hover {
  background-color: #453375;
}

/* Follow Button */
.follow-btn {
  background-color: #8a8eff;
}

.follow-btn:hover {
  background-color: #6c6fff;
}

/* Unfollow Button */
.unfollow-btn {
  background-color: #c90076;
}

.unfollow-btn:hover {
  background-color: #a0005f;
}

</style>
