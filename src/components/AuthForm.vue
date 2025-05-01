<template>
  <router-link to="/Register" v-if="isLogin">
      <b-button>Register</b-button>
    </router-link>
    <router-link to="/Login" v-else>
      <b-button>Login</b-button>
    </router-link>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
    <b-form @submit.prevent="handleSubmit">
      <b-form-group v-if="!isLogin" label="Nom">
          <b-form-input v-model="name" required />
      </b-form-group>

      <b-form-group label="Email">
        <b-form-input v-model="email" type="email" required />
      </b-form-group>

      <b-form-group label="Mot de passe">
        <b-form-input v-model="password" type="password" required />
      </b-form-group>

      <b-button type="submit" variant="primary">
        {{ isLogin ? 'Se connecter' : "S 'inscrire" }}
      </b-button>

      <b-button v-if="isLogin" variant="link" @click="reset">
        Mot de passe oublié ?
      </b-button>

      <b-alert variant="danger" v-if="error" class="mt-3">{{ error }}</b-alert>
    </b-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
isLogin: Boolean
})

const email = ref('')
const password = ref('')
const name = ref('') 
const { login, register, resetPassword, error } = useAuth()

const handleSubmit = async () => {
if (props.isLogin) {
  await login(email.value, password.value)
} else {
  await register(email.value, password.value, name.value)
}
}

const reset = async () => {
if (email.value) {
  await resetPassword(email.value)
  alert('Un e-mail de réinitialisation a été envoyé.')
} else {
  alert('Veuillez entrer votre e-mail.')
}
}
</script>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.auth-container h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.8rem;
}

.b-form-group {
  margin-bottom: 1.5rem;
}

.b-form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.b-form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.b-form-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.b-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.b-button[type="submit"] {
  background-color: #3498db;
  border: none;
  color: white;
  margin-top: 1rem;
}

.b-button[type="submit"]:hover {
  background-color: #2980b9;
}

.b-button[variant="link"] {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #7f8c8d;
  background: none;
  border: none;
  text-decoration: underline;
}

.b-button[variant="link"]:hover {
  color: #3498db;
}

.b-alert {
  margin-top: 1.5rem;
  border-radius: 8px;
  padding: 1rem;
}

.router-link {
  display: block;
  text-align: center;
  margin-bottom: 1rem;
}

.router-link .b-button {
  width: auto;
  padding: 0.5rem 1.5rem;
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.router-link .b-button:hover {
  background-color: #e9ecef;
}

@media (max-width: 576px) {
  .auth-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}

</style>
