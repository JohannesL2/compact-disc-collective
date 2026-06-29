<script setup>
import { onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import CDCard from './components/CDCard.vue'
import { useAlbumStore } from './stores/albums' // Import pinia store for albums

// Activate pinia store
const albumStore = useAlbumStore()

const handleReset = async () => {
  // 1. Töm storens cache
  albumStore.clearCache()
  
  // 2. Hämta direkt de nya skivorna baserat på dina senaste trendingIds
  await albumStore.fetchTrending()
}

// Get cd discs when you enter the site
onMounted(() => {
  albumStore.fetchTrending()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/30 text-gray-900 font-sans antialiased">
    <Sidebar />
    <main class="pl-0 md:pl-64 pb-24 md:pb-0 min-h-screen">
      <div class="max-w-7xl mx-auto p-6 md:p-16 space-y-16">
        <div class="w-full max-w-2xl mx-auto pt-4">
          <div class="relative group">
            <input 
              type="text" 
              placeholder="Sök efter artister, album eller katalognummer..." 
              class="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-gray-900 px-6 py-4 rounded-2xl text-sm font-medium shadow-sm transition-all duration-200 outline-none pr-12"
            />
            <div class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
        <section class="space-y-10">
          <div class="flex flex-col gap-1">
            <h2 class="text-xs font-black uppercase tracking-widest text-gray-400">
              Kurerat Innehåll
            </h2>
            <h3 class="text-xl font-bold text-gray-950 tracking-tight">
              Trending denna vecka
            </h3>
          </div>
          <div v-if="albumStore.loading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
            <CDCard 
              v-for="album in albumStore.trendingList" 
              :key="album.id" 
              :album="album" 
            />
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #fcfcfc;
}
</style>