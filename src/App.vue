<template>
  <div>
    <Navbar v-if="showNavbar" />
    
    <!-- Show Login component only if on /Login and user is not authenticated -->
    <Login v-if="route.name === 'Login' && !user" />

    <router-view v-else />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from '@/components/NavBar.vue'
import Login from './views/Login.vue'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const { user } = useAuth()

const showNavbar = computed(() => {
  return route.name !== 'Login' && route.name !== 'Register'
})
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: #ffffff;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #121212;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
