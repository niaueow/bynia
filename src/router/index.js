import { createRouter, createWebHistory } from 'vue-router'
import { getUser, isAdmin } from '@/lib/auth'

import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import RedirectPage from '@/pages/RedirectPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true },
  },
  {
    // Custom 404 — must come before the catch-all alias redirect
    path: '/404',
    name: 'NotFound',
    component: NotFoundPage,
  },
  {
    // Alias redirect — catches /:alias patterns
    path: '/:alias',
    name: 'Redirect',
    component: RedirectPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard for admin routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { user } = await getUser()
    if (!user) {
      return next({ name: 'Login' })
    }
    if (!isAdmin(user.email)) {
      return next({ name: 'Login', query: { error: 'access_denied' } })
    }
  }
  next()
})

export default router
