<template>
  <div class="auth-page">
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

    <router-link to="/Register" v-if="isLogin">
      <b-button>Register</b-button>
    </router-link>
    <router-link to="/Login" v-else>
      <b-button>Login</b-button>
    </router-link>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuth } from '../composables/useAuth'

// Define props using defineProps
const props = defineProps({
  isLogin: Boolean
})

const email = ref('')
const password = ref('')
const name = ref('')
const { login, register, resetPassword, error, user } = useAuth()

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


// Dynamically import the CSS after Vue has updated the DOM

</script>

<style scoped>
/* DevGate - Design moderne et sombre */

/* Variables pour les couleurs principales */
:root {
  --primary-color: #3498db;
    --primary-hover: #2980b9;
    --background-color: #161625;
    --card-background: #2a2a40;
    --text-color: #ffffff;
    --text-secondary: #a4a6b3;
    --input-background: #1f1f32;
    --input-border: #3a3a5a;
    --shadow-color: rgba(0, 0, 0, 0.5);
    --accent-color: #6c63ff;

}

/* Style global */
.auth-page {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #1e1e2e 0%, #161625 100%);
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
}

/* Layout en 2 colonnes */
.auth-page::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 66.67%; /* 2/3 de l'écran */
  height: 100%;
  background: linear-gradient(135deg, #2a2a40 0%, #1e1e2e 100%);
  z-index: -1;
}
.auth-page > a:first-child {
    position: absolute;
    top: 20px;
    left: 20px;
    text-decoration: none;
    color: var(--text-color);
  }

/* Grand logo central à gauche */
.auth-page::after {
  content: "DevGate";
  position: fixed;
  top: 50%;
  left: 33%; /* Centre du côté gauche (2/3) */
  transform: translate(-50%, -50%);
  font-size: 5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #6c63ff, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 0;
}

/* Tagline sous le logo */
.auth-page > div:first-of-type::before {
  content: "Votre portail vers le développement";
  position: fixed;
  top: calc(-100% + 60px); /* Placer la tagline plus bas que le logo */
  left: -120%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  color: var(--text-secondary);
  z-index: 0;
}

/* Conteneur de formulaire */
.auth-page div:has(> h2) {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 8px 30px var(--shadow-color);
  position: fixed;
  top: 50%;
  right: 16.67%; /* Centre du côté droit (1/3) */
  transform: translate(50%, -50%);
  animation: fadeIn 0.5s ease-in-out;
}

/* Titre du formulaire */
.auth-page h2 {
  color: var(--text-color);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Styles des labels */
.auth-page label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* Champs de formulaire */
.auth-page input[type="text"],
.auth-page input[type="email"],
.auth-page input[type="password"],
.auth-page .form-control {
  width: 100%;
  padding: 0.9rem 1rem;
  background-color: var(--input-background);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 1.2rem;
  box-sizing: border-box;
  background-color: rgba(31, 31, 50, 0.6); /* Fond plus foncé et semi-transparent */
}

.auth-page input[type="text"]:focus,
.auth-page input[type="email"]:focus,
.auth-page input[type="password"]:focus,
.auth-page .form-control:focus {
  color: #ffffff;
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* Boutons */
.auth-page button,
.auth-page .btn,
.auth-page a.btn {
  display: inline-block;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--primary-color);
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.auth-page button:hover,
.auth-page .btn:hover,
.auth-page a.btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Bouton de connexion spécifique */
.auth-page button[type="submit"],
.auth-page .btn-primary {
  width: 100%;
  background-color: var(--primary-color);
  background-image: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.auth-page button[type="submit"]:hover,
.auth-page .btn-primary:hover {
  background-image: linear-gradient(135deg, var(--primary-hover), #5b52e5);
}

/* Lien "mot de passe oublié" */
.auth-page a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  text-align: center;
  display: block;
}

.auth-page a:hover {
  color: var(--accent-color);
}

/* Bouton d'inscription */
.auth-page a:has(>.btn),
.auth-page a:has(button) {
  position: fixed;
  bottom: 20px;
  right: 16.67%;
  transform: translateX(50%);
  z-index: 10;
}

.auth-page a:has(>.btn) .btn,
.auth-page a:has(button) button {
  background-color: transparent;
  color: var(--text-color);
  border: 2px solid var(--accent-color);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.auth-page a:has(>.btn) .btn:hover,
.auth-page a:has(button) button:hover {
  background-color: rgba(108, 99, 255, 0.15);
  color: var(--accent-color);
  transform: translateY(-2px);
}

/* Animation de fondu à l'entrée */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(50%, -50%);
  }
}

/* Responsive pour les tablettes et mobiles */
@media (max-width: 1024px) {
  .auth-page::before {
    width: 0; /* Désactive la division en 2 colonnes */
  }

  .auth-page::after,
  .auth-page > div:first-of-type::before {
    display: none; /* Cache le grand logo et la tagline */
  }

  .auth-page div:has(> h2) {
    position: relative;
    top: 120px;
    right: auto;
    transform: none;
    margin: 0 auto;
  }

  .auth-page a:has(>.btn),
  .auth-page a:has(button) {
    position: absolute;
    bottom: 70px;
    right: 50%;
    transform: translateX(50%);
  }
}

@media (max-width: 480px) {
  .auth-page div:has(> h2) {
    padding: 1.5rem;
    max-width: 90%;
  }
}

/* Forcer le fond sombre même en focus */
.auth-page input[type="text"]:focus,
.auth-page input[type="email"]:focus,
.auth-page input[type="password"]:focus,
.auth-page .form-control:focus {
  background-color: rgba(31, 31, 50, 0.6); /* Réaffirme le fond sombre ici */
  color: #ffffff; /* Ajoute cette ligne pour forcer le texte en blanc */
  caret-color: var(--text-color); /* Facultatif mais améliore la visibilité du curseur */
}

/* Corrige le fond blanc lors de l'autocomplétion (Chrome) */
.auth-page input:-webkit-autofill,
.auth-page input:-webkit-autofill:hover,
.auth-page input:-webkit-autofill:focus,
.auth-page input:-webkit-autofill:active {
  transition: background-color 9999s ease-in-out 0s;
  -webkit-text-fill-color: var(--text-color) !important;
  caret-color: var(--text-color);
  color: #ffffff;
  box-shadow: 0 0 0px 1000px rgba(31, 31, 50, 0.6) inset !important;
}
</style>


 
