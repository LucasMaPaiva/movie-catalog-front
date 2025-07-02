import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.js'
import LoginView from '@/app/auth/views/LoginView.vue'
import LayoutComponent from '@/shared/components/layout/LayoutComponent.vue'
import RegisterView from '@/app/auth/views/RegisterView.vue'

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
          component: () => import('@/app/home/views/HomeView.vue'),
        },
        {
          path: "/favorites",
          name: "favorites",
          component: () => import("@/app/favorites/views/FavoritesView.vue")
        },
        {
          path: "/search",
          name: "searchResults",
          component: () => import('@/app/home/views/SearchResultsView.vue'),
          props: (route) => ({ query: route.query.query })
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../../components/utils/NotFoundView.vue')
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
