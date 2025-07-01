import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../../../views/HomeView.vue'
// import RegisterView from '../../../views/Auth/RegisterView.vue'
// import FavoritesView from '../../../views/FavoritesView.vue'
import { useAuthStore } from '../../../stores/auth.js'
import LoginView from '@/views/Auth/LoginView.vue'
import LayoutComponent from '@/shared/components/LayoutComponent.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/",
      name: "Layout",
      component: LayoutComponent,
      children: [
        {
          path: '/',
          name: "home",
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: "/favorites",
          name: "favorites",
          component: () => import("@/views/FavoritesView.vue")
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../../../views/NotFoundView.vue')
    }
  ]
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {

    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {

    next({ name: 'home' });
  } else {
    next();
  }
});

export default router
