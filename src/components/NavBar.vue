<template>
    <nav class="navbar">
      <h1 class="logo">DevGate</h1>
      <router-link to="/Principale" >
      <button v-if="user">Retour</button>
    </router-link>
      <div v-if="user">
        <button @click="logout" class="btn-logout">Déconnecter</button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
  import { useRouter } from 'vue-router'
  
  const user = ref(null)
  const auth = getAuth()
  const router = useRouter()
  
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
    })
  })
  
  const logout = async () => {
    await signOut(auth)
    router.push('/login')
  }
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
  