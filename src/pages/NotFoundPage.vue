<template>
  <main class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
    <!-- 404 Illustration -->
    <div class="mb-4 sm:mb-6 md:mb-8 animate-fade-in w-full max-w-xs sm:max-w-sm md:max-w-md">
      <img
        src="/404.png"
        alt="404 Page Not Found"
        class="w-full h-auto mx-auto"
        id="not-found-illustration"
      />
    </div>

    <!-- Message -->
    <div class="text-center animate-slide-up px-4">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-black mb-2 sm:mb-3">Oops!</h1>
      <p class="text-gray text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
        This link doesn't exist or may have been removed.
      </p>

      <!-- CTA -->
      <router-link
        to="/"
        class="btn btn-primary text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3"
        id="go-home-btn"
      >
        Go Back Home
      </router-link>
    </div>
  </main>
</template>
