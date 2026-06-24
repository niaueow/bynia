<template>
  <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
    <div class="w-full max-w-sm sm:max-w-md animate-fade-in">
      <!-- Access Denied State -->
      <div v-if="accessDenied" class="card-brutal text-center">
        <div class="w-12 h-12 sm:w-14 sm:h-14 bg-red rounded-full border-[2.5px] border-black flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-black mb-2">Access Denied</h1>
        <p class="text-gray text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">
          You don't have permission to access this dashboard.
        </p>
        <router-link to="/" class="btn btn-primary w-full text-sm py-2.5 sm:py-3" id="login-go-home">
          Go Back Home
        </router-link>
      </div>

      <!-- Login State -->
      <div v-else class="card-brutal text-center">
        <div class="w-12 h-12 sm:w-14 sm:h-14 bg-blue rounded-full border-[2.5px] border-black flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-black mb-2">Admin Login</h1>
        <p class="text-gray text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">
          Sign in with your Google account to access the dashboard.
        </p>
        <button
          @click="handleLogin"
          class="btn btn-primary w-full text-sm py-2.5 sm:py-3 gap-3"
          :disabled="loading"
          id="google-login-btn"
        >
          <!-- Google Icon -->
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign in with Google</span>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { signInWithGoogle } from '@/lib/auth'

const route = useRoute()
const loading = ref(false)
const accessDenied = ref(false)

onMounted(() => {
  if (route.query.error === 'access_denied') {
    accessDenied.value = true
  }
})

async function handleLogin() {
  loading.value = true
  const { error } = await signInWithGoogle()
  if (error) {
    console.error('Login error:', error)
    loading.value = false
  }
}
</script>
