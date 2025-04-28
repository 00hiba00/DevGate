import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { auth} from '@/firebase/firebase.js';
import HomeView from '@/views/HomeView.vue';
import Principale from '@/views/Principale.vue';
import Users from '@/views/Users.vue'
const routes = [
  { path: '/Login', component: Login},
  { path: '/Register', component: Register},
  
  { path: '/', component: HomeView },
  {path: '/Principale', component: Principale},
  {path:'/Users', component: Users},
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  }
  
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