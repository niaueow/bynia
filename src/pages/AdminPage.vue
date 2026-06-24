<template>
  <main class="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 max-w-6xl mx-auto w-full">
    <div class="animate-fade-in">
      <!-- Page Title -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-black mb-1">Dashboard</h1>
        <p class="text-gray text-xs sm:text-sm">Monitor and manage your shortened links.</p>
      </div>

      <!-- Metrics Cards -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <!-- Total Links -->
        <div class="bg-cream border-[2.5px] border-black shadow-brutal p-4 sm:p-5" id="metric-total-links">
          <p class="text-gray text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">Total Links</p>
          <p class="text-2xl sm:text-3xl font-extrabold text-black">{{ totalLinks }}</p>
        </div>
        <!-- Total Clicks -->
        <div class="bg-pink border-[2.5px] border-black shadow-brutal p-4 sm:p-5" id="metric-total-clicks">
          <p class="text-black/70 text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">Total Clicks</p>
          <p class="text-2xl sm:text-3xl font-extrabold text-black">{{ totalClicks }}</p>
        </div>
      </div>

      <!-- Search + Actions Bar -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5">
        <!-- Search -->
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="search-input"
            type="search"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search by alias or URL..."
            class="pl-10!"
          />
        </div>

        <!-- Bulk Actions -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-if="selectedIds.length > 0"
            @click="confirmBulkDelete"
            class="btn btn-danger text-xs sm:text-sm px-3 sm:px-4 py-2"
            id="delete-selected-btn"
          >
            Delete Selected ({{ selectedIds.length }})
          </button>
          <button
            v-if="links.length > 0"
            @click="confirmDeleteAll"
            class="btn btn-ghost text-xs sm:text-sm px-3 sm:px-4 py-2"
            id="delete-all-btn"
          >
            Delete All
          </button>
        </div>
      </div>

      <!-- Desktop Table (hidden on mobile) -->
      <div class="hidden sm:block border-[2.5px] border-black overflow-x-auto bg-white shadow-brutal">
        <table class="w-full text-sm" id="links-table">
          <thead>
            <tr class="border-b-[2.5px] border-black bg-cream">
              <th class="p-3 text-left w-10">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  id="select-all-checkbox"
                />
              </th>
              <th class="p-3 text-left font-bold text-black">Alias</th>
              <th class="p-3 text-left font-bold text-black">Original URL</th>
              <th class="p-3 text-left font-bold text-black w-20">Clicks</th>
              <th class="p-3 text-left font-bold text-black w-32">Created At</th>
              <th class="p-3 text-left font-bold text-black w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="link in links"
              :key="link.id"
              class="border-b border-black/10 hover:bg-cream/50 transition-colors"
            >
              <td class="p-3">
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(link.id)"
                  @change="toggleSelect(link.id)"
                />
              </td>
              <td class="p-3 font-semibold text-blue">
                <a
                  :href="`https://bynia.vercel.app/${link.alias}`"
                  target="_blank"
                  class="hover:underline"
                >
                  {{ link.alias }}
                </a>
              </td>
              <td class="p-3 text-gray max-w-xs truncate" :title="link.original_url">
                {{ link.original_url }}
              </td>
              <td class="p-3 font-bold text-black">{{ link.clicks }}</td>
              <td class="p-3 text-gray text-xs">{{ formatDate(link.created_at) }}</td>
              <td class="p-3">
                <button
                  @click="confirmSingleDelete(link)"
                  class="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-red hover:text-white hover:border-red transition-colors"
                  :id="`delete-${link.id}`"
                  aria-label="Delete link"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="links.length === 0 && !loadingLinks">
              <td colspan="6" class="p-10 text-center text-gray">
                <div class="flex flex-col items-center gap-2">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  <p class="font-semibold">No links yet</p>
                  <p class="text-sm">Links created by visitors will appear here.</p>
                </div>
              </td>
            </tr>

            <!-- Loading State -->
            <tr v-if="loadingLinks">
              <td colspan="6" class="p-10 text-center">
                <svg class="animate-spin h-6 w-6 text-blue mx-auto" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card List (shown only on mobile) -->
      <div class="sm:hidden flex flex-col gap-3">
        <!-- Select All -->
        <div v-if="links.length > 0" class="flex items-center gap-2 px-1">
          <input
            type="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll"
            id="select-all-mobile"
          />
          <label for="select-all-mobile" class="text-xs font-semibold text-gray cursor-pointer">Select all</label>
        </div>

        <!-- Link Cards -->
        <div
          v-for="link in links"
          :key="'mobile-' + link.id"
          class="bg-white border-[2.5px] border-black shadow-brutal-sm p-4"
        >
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-2 min-w-0">
              <input
                type="checkbox"
                :checked="selectedIds.includes(link.id)"
                @change="toggleSelect(link.id)"
                class="mt-0.5"
              />
              <a
                :href="`https://bynia.vercel.app/${link.alias}`"
                target="_blank"
                class="font-bold text-blue text-sm hover:underline truncate"
              >
                {{ link.alias }}
              </a>
            </div>
            <button
              @click="confirmSingleDelete(link)"
              class="w-7 h-7 bg-white border-2 border-black flex items-center justify-center hover:bg-red hover:text-white hover:border-red transition-colors flex-shrink-0"
              aria-label="Delete link"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
          <p class="text-gray text-xs break-all mb-2 pl-7">{{ link.original_url }}</p>
          <div class="flex items-center justify-between pl-7">
            <span class="text-xs font-bold text-black">{{ link.clicks }} clicks</span>
            <span class="text-xs text-gray">{{ formatDate(link.created_at) }}</span>
          </div>
        </div>

        <!-- Empty State (mobile) -->
        <div v-if="links.length === 0 && !loadingLinks" class="bg-white border-[2.5px] border-black p-8 text-center text-gray">
          <svg class="mx-auto mb-2" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <p class="font-semibold text-sm">No links yet</p>
          <p class="text-xs mt-1">Links created by visitors will appear here.</p>
        </div>

        <!-- Loading State (mobile) -->
        <div v-if="loadingLinks" class="p-8 text-center">
          <svg class="animate-spin h-6 w-6 text-blue mx-auto" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      </div>
    </div>
  </main>

  <!-- Confirm Modal -->
  <ConfirmModal
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    :confirm-text="modalConfirmText"
    @confirm="handleModalConfirm"
    @cancel="showModal = false"
  />

  <!-- Toast -->
  <ToastNotification
    :show="showToast"
    :message="toastMessage"
    @close="showToast = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllLinks, searchLinks, deleteLink, deleteLinks, deleteAllLinks, getTotalClicks } from '@/lib/links'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'

// Data
const links = ref([])
const totalLinks = ref(0)
const totalClicks = ref(0)
const loadingLinks = ref(true)
const searchQuery = ref('')
const selectedIds = ref([])

// Toast
const showToast = ref(false)
const toastMessage = ref('')

// Modal
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('Delete')
let modalAction = null

// Computed
const allSelected = computed(() => {
  return links.value.length > 0 && selectedIds.value.length === links.value.length
})

// --- Data Loading ---
async function loadLinks() {
  loadingLinks.value = true
  const { data, error } = await getAllLinks()
  if (!error && data) {
    links.value = data
    totalLinks.value = data.length
  }
  loadingLinks.value = false
}

async function loadTotalClicks() {
  const { total } = await getTotalClicks()
  totalClicks.value = total
}

async function loadData() {
  await Promise.all([loadLinks(), loadTotalClicks()])
}

// --- Search ---
let searchTimer = null
function handleSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(async () => {
    if (searchQuery.value.trim() === '') {
      await loadLinks()
      return
    }
    loadingLinks.value = true
    const { data, error } = await searchLinks(searchQuery.value.trim())
    if (!error && data) {
      links.value = data
    }
    loadingLinks.value = false
  }, 300)
}

// --- Selection ---
function toggleSelect(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = links.value.map(l => l.id)
  }
}

// --- Delete Actions ---
function confirmSingleDelete(link) {
  modalTitle.value = 'Delete Link'
  modalMessage.value = `Are you sure you want to delete "${link.alias}"? This action cannot be undone.`
  modalConfirmText.value = 'Delete'
  modalAction = async () => {
    await deleteLink(link.id)
    showToast.value = false
    toastMessage.value = 'Link deleted successfully.'
    showToast.value = true
    await loadData()
  }
  showModal.value = true
}

function confirmBulkDelete() {
  modalTitle.value = 'Delete Selected Links'
  modalMessage.value = `Are you sure you want to delete ${selectedIds.value.length} selected link(s)? This action cannot be undone.`
  modalConfirmText.value = 'Delete All Selected'
  modalAction = async () => {
    await deleteLinks([...selectedIds.value])
    selectedIds.value = []
    showToast.value = false
    toastMessage.value = 'Selected links deleted.'
    showToast.value = true
    await loadData()
  }
  showModal.value = true
}

function confirmDeleteAll() {
  modalTitle.value = 'Delete All Links'
  modalMessage.value = 'Are you sure you want to delete ALL links? This action cannot be undone.'
  modalConfirmText.value = 'Delete Everything'
  modalAction = async () => {
    await deleteAllLinks()
    selectedIds.value = []
    showToast.value = false
    toastMessage.value = 'All links deleted.'
    showToast.value = true
    await loadData()
  }
  showModal.value = true
}

async function handleModalConfirm() {
  showModal.value = false
  if (modalAction) {
    await modalAction()
    modalAction = null
  }
}

// --- Helpers ---
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// --- Init ---
onMounted(() => {
  loadData()
})
</script>
