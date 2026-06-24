<template>
  <header class="w-full border-b-[2.5px] border-black bg-white">
    <div class="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-3 flex items-center justify-between">
      <!-- Logo + Brand -->
      <router-link to="/" class="flex items-center gap-2.5 no-underline" id="header-logo">
        <div class="w-8 h-8 bg-blue border-[2.5px] border-black flex items-center justify-center">
          <span class="text-white font-extrabold text-base leading-none">n</span>
        </div>
        <span class="text-black font-bold text-sm tracking-tight">bynia tiny links</span>
      </router-link>

      <!-- Login / Admin Button -->
      <div>
        <router-link
          v-if="!isLoggedIn"
          to="/login"
          class="btn btn-primary text-sm px-5 py-2"
          id="header-login-btn"
        >
          Login
        </router-link>
        <div v-else class="flex items-center gap-2 sm:gap-3">
          <router-link
            to="/admin"
            class="btn btn-outline text-xs sm:text-sm px-3 sm:px-4 py-2"
            id="header-admin-btn"
          >
            Dashboard
          </router-link>
          <button
            @click="handleSignOut"
            class="btn btn-ghost text-xs sm:text-sm px-3 sm:px-4 py-2"
            id="header-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSession, signOut, onAuthStateChange } from '@/lib/auth'

const router = useRouter()
const isLoggedIn = ref(false)

async function checkSession() {
  const { session } = await getSession()
  isLoggedIn.value = !!session
}

async function handleSignOut() {
  await signOut()
  isLoggedIn.value = false
  router.push('/')
}

let unsubscribe

onMounted(() => {
  checkSession()
  unsubscribe = onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      isLoggedIn.value = true
    } else if (event === 'SIGNED_OUT') {
      isLoggedIn.value = false
    }
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
