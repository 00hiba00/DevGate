<template>
  <div>
    <router-link to="/Login" v-if="!isLoggedIn">
      <button>Login</button>
    </router-link>

    <router-link to="/Register" v-if="!isLoggedIn">
      <button>Register</button>
    </router-link>

    <b-button v-if="isLoggedIn" variant="outline-danger" @click="handleLogout" class="mb-3 float-end">
      Se déconnecter
    </b-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const { logout, user } = useAuth();
const router = useRouter();

const isLoggedIn = computed(() => !!user.value);

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (err) {
    console.error('Erreur de déconnexion:', err.message);
  }
};
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}

.float-end {
  float: right;
}
</style>