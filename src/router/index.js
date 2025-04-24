import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue';
import Login from '@/views/LoginView.vue';
import Profile from '@/views/ProfilView.vue';
import Register from '@/views/RegisterView.vue';
import { auth} from '@/firebase/firebase.js';

const routes = [
  { path: '/', component: Home},
  { path: '/Login', component: Login},
  { path: '/Profile', component: Profile, meta: { requiresAuth: true }},
  { path: '/Register', component: Register}, 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' }); 
  } else {
    next();
  }
});

export default router