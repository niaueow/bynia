<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-toast-in"
      leave-active-class="animate-toast-out"
    >
      <div
        v-if="visible"
        class="fixed bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:top-5 sm:right-5 z-50 bg-white border-[2.5px] border-black shadow-brutal px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 sm:max-w-sm"
        role="alert"
        id="toast-notification"
      >
        <!-- Success icon -->
        <div class="w-6 h-6 bg-green rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="font-semibold text-sm text-black">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const emit = defineEmits(['close'])
const visible = ref(false)
let timer = null

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
      emit('close')
    }, props.duration)
  } else {
    visible.value = false
  }
})
</script>

<style scoped>
.animate-toast-in {
  animation: slideInRight 0.3s ease-out;
}

.animate-toast-out {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideOutRight {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}
</style>
