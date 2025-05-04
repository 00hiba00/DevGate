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
/* Tous vos styles originaux préservés */
.user-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
  transition: all 0.6s cubic-bezier(0.25,0.8,0.25,1);
  position: relative;
}

.user-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 25px 50px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,154,158,0.2);
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #FF9A9E, #FAD0C4);
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 2.5rem auto 1.5rem;
  background: linear-gradient(45deg, #FF9A9E, #FAD0C4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(255,154,158,0.3);
}

.user-info {
  padding: 0 2rem 2rem;
  text-align: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}


.user-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.user-email {
  color: #888;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.user-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* Style original du bouton "Voir le profil" */
.connect-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #FF9A9E, #FAD0C4);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25,0.8,0.25,1);
  box-shadow: 0 5px 15px rgba(255,154,158,0.3);
}

.connect-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255,154,158,0.4);
}

/* Nouveaux styles uniquement pour les boutons de suivi */
.follow-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: #42b983;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25,0.8,0.25,1);
  box-shadow: 0 5px 15px rgba(66,185,131,0.3);
}

.unfollow-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: #888;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25,0.8,0.25,1);
  box-shadow: 0 5px 15px rgba(136,136,136,0.3);
}

.follow-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(66,185,131,0.4);
}

.unfollow-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(136,136,136,0.4);
}
</style>