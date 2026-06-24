<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        id="confirm-modal-overlay"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="$emit('cancel')"></div>

        <!-- Modal -->
        <div class="relative bg-white border-[2.5px] border-black shadow-brutal-lg p-6 max-w-md w-full animate-fade-in">
          <!-- Title -->
          <h3 class="text-xl font-bold text-black mb-2">{{ title }}</h3>

          <!-- Message -->
          <p class="text-gray text-sm mb-6 leading-relaxed">{{ message }}</p>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3">
            <button
              class="btn btn-ghost text-sm px-5 py-2"
              @click="$emit('cancel')"
              id="confirm-modal-cancel"
            >
              Cancel
            </button>
            <button
              class="btn btn-danger text-sm px-5 py-2"
              @click="$emit('confirm')"
              id="confirm-modal-confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Are you sure?',
  },
  message: {
    type: String,
    default: 'This action cannot be undone.',
  },
  confirmText: {
    type: String,
    default: 'Delete',
  },
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
