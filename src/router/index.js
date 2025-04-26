import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { auth} from '@/firebase/firebase.js';
import HomeView from '@/views/HomeView.vue';
import Principale from '@/views/Principale.vue';
import Users from '@/views/Users.vue'
import Profile from '@/views/Profile.vue';
const routes = [
  { path: '/Login', component: Login},
  { path: '/Register', component: Register},
  
  { path: '/', component: HomeView },
  {path: '/Principale', component: Principale},
  {path:'/Users', component: Users},
  {
    path: '/Profile/:userId',
    name: 'Profile',  // This name must match what you use in router.push()
    component: Profile,
    props: true,  // This will pass the params as props to ProfileCard
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router