<template>
  <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
    <div class="w-full max-w-[720px]">
      <!-- Main Card -->
      <div class="card-brutal animate-fade-in">
        <!-- Title -->
        <h1 class="text-2xl sm:text-[1.7rem] md:text-[1.85rem] font-extrabold text-black mb-1 leading-tight">
          Shorten your link
        </h1>
        <p class="text-gray text-sm md:text-base mb-7 sm:mb-8">
          Long links are a lot. Let's make them shorter.
        </p>

        <!-- Form -->
        <form @submit.prevent="handleShorten" v-if="!success">
          <!-- URL Input -->
          <div class="mb-5 sm:mb-6">
            <label class="block font-bold text-black text-base sm:text-[1.05rem] mb-0.5" for="url-input">URL</label>
            <span class="block text-gray text-sm mb-2.5">Enter your long URL</span>
            <input
              id="url-input"
              type="text"
              v-model="url"
              placeholder="yourlink.com"
              :class="{ 'border-red!': errors.url }"
              @input="errors.url = ''"
            />
            <p v-if="errors.url" class="text-red text-xs sm:text-sm font-semibold mt-1.5 sm:mt-2">
              {{ errors.url }}
            </p>
          </div>

          <!-- Alias Input -->
          <div class="mb-5 sm:mb-6">
            <div class="flex flex-row">
              <!-- Prefix -->
              <div class="bg-white border-[2.5px] border-black px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-sm text-black whitespace-nowrap flex items-center border-r-0 shrink-0">
                bynia.vercel.app/
              </div>
              <!-- Alias input -->
              <input
                id="alias-input"
                type="text"
                v-model="alias"
                placeholder="Enter your short link"
                :class="{ 'border-red!': errors.alias }"
                @input="errors.alias = ''"
                class="flex-1 min-w-0"
              />
            </div>
            <p v-if="errors.alias" class="text-red text-xs sm:text-sm font-semibold mt-1.5 sm:mt-2">
              {{ errors.alias }}
            </p>
          </div>

          <!-- Generate QR Checkbox -->
          <label class="flex items-center gap-2.5 cursor-pointer mb-6 sm:mb-7 select-none" for="qr-checkbox">
            <input
              id="qr-checkbox"
              type="checkbox"
              v-model="generateQR"
            />
            <span class="font-semibold text-sm text-black">Generate QR</span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary w-full text-sm sm:text-base py-3.5"
            :disabled="loading"
            id="shorten-btn"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Creating...
            </span>
            <span v-else>Shorten Link</span>
          </button>

          <!-- Rate Limit Error -->
          <p v-if="errors.rateLimit" class="text-red text-xs sm:text-sm font-semibold mt-3 sm:mt-4 text-center">
            {{ errors.rateLimit }}
          </p>
        </form>

        <!-- Success State -->
        <div v-if="success" class="animate-slide-up">
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <div class="w-6 h-6 sm:w-7 sm:h-7 bg-green rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-black">Your short link is ready!</h2>
          </div>
          <p class="text-gray text-xs sm:text-sm mb-4 sm:mb-6">Share it anywhere.</p>

          <!-- Generated URL -->
          <div class="flex flex-col sm:flex-row mb-4 sm:mb-5">
            <div class="flex-1 bg-white border-[2.5px] border-black px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-blue text-xs sm:text-sm break-all sm:border-r-0 border-b-0 sm:border-b-[2.5px]">
              {{ generatedUrl }}
            </div>
            <button
              @click="copyToClipboard"
              class="btn btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3"
              id="copy-btn"
            >
              {{ copied ? '✓ Copied!' : 'Copy Link' }}
            </button>
          </div>

          <!-- QR Code Preview -->
          <div v-if="qrCodeDataUrl" class="mt-5 sm:mt-6 flex flex-col items-center">
            <div class="bg-white border-[2.5px] border-black p-3 sm:p-4 shadow-brutal inline-block">
              <img
                :src="qrCodeDataUrl"
                alt="QR Code"
                class="w-32 h-32 sm:w-40 sm:h-40"
                id="qr-preview"
              />
            </div>
            <a
              :href="qrCodeDataUrl"
              download="bynia-qr.png"
              class="btn btn-outline text-xs sm:text-sm px-4 sm:px-5 py-2 mt-3 sm:mt-4"
              id="download-qr-btn"
            >
              Download QR
            </a>
          </div>

          <!-- Create Another -->
          <button
            @click="resetForm"
            class="btn btn-ghost w-full text-xs sm:text-sm mt-5 sm:mt-6"
            id="create-another-btn"
          >
            Create another link
          </button>
        </div>
      </div>
    </div>
  </main>

  <!-- Toast -->
  <ToastNotification
    :show="showToast"
    :message="toastMessage"
    @close="showToast = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import { createLink, getLinkByAlias } from '@/lib/links'
import ToastNotification from '@/components/ToastNotification.vue'
import QRCode from 'qrcode'

// Form state
const url = ref('')
const alias = ref('')
const generateQR = ref(false)
const loading = ref(false)
const success = ref(false)
const generatedUrl = ref('')
const qrCodeDataUrl = ref('')
const copied = ref(false)

// Errors
const errors = ref({
  url: '',
  alias: '',
  rateLimit: '',
})

// Toast
const showToast = ref(false)
const toastMessage = ref('')

// --- Rate Limiting ---
const DAILY_LIMIT = 3
const STORAGE_KEY = 'bynia_daily_links'

function getRateLimitData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isRateLimited() {
  const data = getRateLimitData()
  if (!data) return false

  const today = new Date().toISOString().split('T')[0]
  if (data.date !== today) return false

  return data.count >= DAILY_LIMIT
}

function incrementRateLimit() {
  const today = new Date().toISOString().split('T')[0]
  const data = getRateLimitData()

  if (!data || data.date !== today) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 1 }))
  } else {
    data.count += 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

// --- Validation ---
function validateUrl(value) {
  if (!value.trim()) return 'URL is required.'

  // Prepend https:// if no protocol
  let testUrl = value.trim()
  if (!/^https?:\/\//i.test(testUrl)) {
    testUrl = 'https://' + testUrl
  }

  try {
    const parsed = new URL(testUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return "Oops! That URL doesn't seem valid.\n\nDouble-check the format and try again."
    }
    return ''
  } catch {
    return "Oops! That URL doesn't seem valid.\n\nDouble-check the format and try again."
  }
}

function validateAlias(value) {
  if (!value.trim()) return 'Alias is required.'

  const trimmed = value.trim()
  if (trimmed.length < 3) return 'Alias must be at least 3 characters.'
  if (trimmed.length > 30) return 'Alias must be 30 characters or less.'
  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return 'Only lowercase letters, numbers, hyphens, and underscores are allowed.'
  }

  // Reserved routes
  const reserved = ['admin', 'login', '404']
  if (reserved.includes(trimmed)) {
    return 'This alias is reserved. Please choose another.'
  }

  return ''
}

// --- Form Actions ---
async function handleShorten() {
  // Reset errors
  errors.value = { url: '', alias: '', rateLimit: '' }

  // Rate limit check
  if (isRateLimited()) {
    errors.value.rateLimit = "You've reached today's limit of 3 links.\n\nCome back tomorrow to create more."
    return
  }

  // Validate
  const urlError = validateUrl(url.value)
  const aliasError = validateAlias(alias.value)

  if (urlError) errors.value.url = urlError
  if (aliasError) errors.value.alias = aliasError

  if (urlError || aliasError) return

  loading.value = true

  try {
    // Normalize URL
    let normalizedUrl = url.value.trim()
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    const trimmedAlias = alias.value.trim()

    // Check if alias already exists
    const { data: existing } = await getLinkByAlias(trimmedAlias)
    if (existing) {
      errors.value.alias = "Oops! This alias is already taken.\n\nTry another alias to make your link unique."
      loading.value = false
      return
    }

    // Create link
    const { data, error } = await createLink(trimmedAlias, normalizedUrl)

    if (error) {
      if (error.code === '23505') {
        errors.value.alias = "Oops! This alias is already taken.\n\nTry another alias to make your link unique."
      } else {
        errors.value.url = 'Something went wrong. Please try again.'
      }
      loading.value = false
      return
    }

    // Success
    generatedUrl.value = `bynia.vercel.app/${trimmedAlias}`
    incrementRateLimit()

    // Generate QR if enabled
    if (generateQR.value) {
      try {
        qrCodeDataUrl.value = await QRCode.toDataURL(`https://bynia.vercel.app/${trimmedAlias}`, {
          width: 320,
          margin: 2,
          color: {
            dark: '#1E1E1E',
            light: '#FFFFFF',
          },
        })
      } catch (qrError) {
        console.error('QR generation failed:', qrError)
      }
    }

    success.value = true
  } catch (err) {
    errors.value.url = 'Something went wrong. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(`https://${generatedUrl.value}`)
    copied.value = true
    toastMessage.value = 'Link copied to clipboard!'
    showToast.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

function resetForm() {
  url.value = ''
  alias.value = ''
  generateQR.value = false
  success.value = false
  generatedUrl.value = ''
  qrCodeDataUrl.value = ''
  copied.value = false
  errors.value = { url: '', alias: '', rateLimit: '' }
}
</script>
