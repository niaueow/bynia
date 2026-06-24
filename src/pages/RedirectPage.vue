<template>
  <main class="flex-1 flex items-center justify-center px-4 py-10">
    <div class="text-center animate-fade-in" v-if="!loading">
      <p class="text-gray text-sm mb-1">Redirecting you...</p>
    </div>

    <div class="text-center animate-fade-in" v-if="loading">
      <svg class="animate-spin h-8 w-8 text-blue mx-auto mb-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="text-gray font-semibold">Redirecting...</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLinkByAlias, incrementClicks } from '@/lib/links'

const route = useRoute()
const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  const alias = route.params.alias

  if (!alias) {
    router.replace('/404')
    return
  }

  try {
    const { data, error } = await getLinkByAlias(alias)

    if (error || !data) {
      router.replace('/404')
      return
    }

    // Increment click count (fire and forget)
    incrementClicks(alias)

    // Redirect to original URL
    window.location.href = data.original_url
  } catch (err) {
    console.error('Redirect error:', err)
    router.replace('/404')
  }
})
</script>
