<template>
  <div class="user-card">
    <div class="user-avatar">
      {{ user.name.charAt(0).toUpperCase() }}
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
.user-card {
  background: #242424;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(127, 96, 249, 0.05);
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  color: #f1f1f1;
}

.user-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 25px 50px rgba(127, 96, 249, 0.1),
    0 0 0 1px rgba(127, 96, 249, 0.3);
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(90deg, #7f60f9,rgb(63, 29, 185));
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 2.5rem auto 1.5rem;
  background: linear-gradient(45deg, #7f60f9,rgb(40, 25, 180));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(127, 96, 249, 0.3);
}

.user-info {
  padding: 0 2rem 2rem;
  text-align: center;
}

.user-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #eaeaea;
  margin-bottom: 0.3rem;
}

.user-email {
  color: #bbbbbb;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.user-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* Bouton "Voir le profil" */
.connect-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #7f60f9,rgb(22, 26, 230));
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 5px 15px rgba(127, 96, 249, 0.3);
}

.connect-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(127, 96, 249, 0.5);
}

/* Boutons Suivre / Suivi */
.follow-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background:rgb(78, 100, 224);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(37, 111, 196, 0.3);
}

.follow-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(53, 100, 187, 0.5);
}

.unfollow-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: #444;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.05);
}

.unfollow-btn:hover {
  background-color: #666;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
}

</style>