<template>
    <nav class="navbar">
      <h1 class="logo">DevGate</h1>
      <router-link to="/Users" >
      <button v-if="user">Users</button>
    </router-link>
    <router-link to="/Principale" >
      <button v-if="user">Dashboard</button>
    </router-link>
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
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f5f5f5;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  .logo {
    font-weight: bold;
    font-size: 1.5rem;
  }
  .btn-logout {
    background-color: #e3342f;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
  }
  .btn-logout:hover {
    background-color: #cc1f1a;
  }
  </style>
  