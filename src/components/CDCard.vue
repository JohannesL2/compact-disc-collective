<script setup>
// define props and tell vue that we need the album cover from albums.js
defineProps({
  album: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="group relative w-64 cursor-pointer">
    <div class="relative w-48 h-48 z-10 shadow-lg bg-white">
      <!-- Jewelcase front -->
      <img :src="album.cover" class="w-full h-full object-cover z-20 relative rounded-sm shadow-md" />
      
      <!-- CD-disc showing on hover -->
      <div class="absolute top-2 w-44 h-44 left-6 rounded-full bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-inner transform transition-transform duration-500 group-hover:translate-x-20 z-0 flex items-center justify-center overflow-hidden">
        
        <!-- Album cover for the cd -->
        <img 
          :src="album.cover" 
          class="absolute inset-0 w-full h-full object-cover rounded-full opacity-60 mix-blend-luminosity scale-105" 
        />
        
        <!-- Gradient to make it look more like a real cd -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-black/10 pointer-events-none"></div>

        <!-- Hole overlay for cd disc -->
        <div class="w-12 h-12 rounded-full bg-white border border-gray-200/80 flex items-center justify-center z-10 shadow-sm">
          <div class="w-4 h-4 rounded-full bg-transparent border border-gray-300"></div>
        </div>

      </div>
    </div>
    
    <div class="mt-6">
      <h3 class="font-bold text-gray-900 text-sm m-0">{{ album.artist }}</h3>
      <p class="text-gray-500 text-sm m-0">{{ album.title }}</p>
      <div class="mt-4 flex items-baseline gap-2">
        <span class="text-xs text-gray-400 uppercase tracking-wider">Value</span>
        <span class="text-sm font-bold text-gray-900">{{ album.price }} KR</span>
      </div>
    </div>
  </div>
</template>