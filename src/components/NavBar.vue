<template>
    <nav class="navbar">
      <h1 class="logo">DevGate</h1>
      <router-link to="/Users" >
      <button v-if="user">Users</button>
    </router-link>
    <router-link to="/Principale" >
      <button v-if="user">Dashboard</button>
    </router-link>
    <router-link to="/Activite">
      <button v-if="user">Activite</button>
    </router-link>
        <button  v-if="user" @click="viewMyProfile" class="btn profile-btn">
  Voir mon profil
</button>
      <div v-if="user">
        <button @click="handleLogout" class="btn-logout">Déconnecter</button>
      </div>
    </nav>
  </template>
  
  <script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const { logout, user } = useAuth();
const router = useRouter();

const viewMyProfile = () => {
  router.push('/my-profile');
};
const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (err) {
    console.error('Erreur de déconnexion:', err.message);
  }
};
  </script>
<style>
@import '../assets/styles/navbar.css';
</style>
  
