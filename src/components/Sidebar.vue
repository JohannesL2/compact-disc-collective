<script setup>
import { ref } from 'vue'
import { useAlbumStore } from '../stores/albums'
//Import modern icons
import { 
  Compass,      // "Explore"
  Disc,         // "My Collection"
  Heart,        // "Wishlist"
  BarChart2,     // "Analytics"
  Trash2
} from 'lucide-vue-next'

const albumStore = useAlbumStore()
// Check which menuitem is active
const activeItem = ref('Explore')

// Menu structure
const menuItems = [
  { name: 'Explore', icon: Compass },
  { name: 'My Collection', icon: Disc },
  { name: 'Wishlist', icon: Heart },
  { name: 'Analytics', icon: BarChart2 }
]

const handleReset = async () => {
  albumStore.clearCache()
  await albumStore.fetchTrending()
}
</script>

<template>
  <aside class="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-8 fixed left-0 top-0 z-30 select-none">
    
    <div>
      <div class="flex items-center gap-3 mb-12">
        <div class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-xs tracking-tighter">
          <div class="w-2 h-2 rounded-full bg-gray-200 flex items-center justify-center text-white font-black text-xs tracking-tighter">
          </div>
        </div>
        <h1 class="text-base font-bold text-gray-900 leading-tight tracking-tight">
          Compact Disc<br>
          <span class="text-gray-500 font-medium">Collective</span>
        </h1>
      </div>
      <nav class="space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.name"
          @click="activeItem = item.name"
          :class="[
            'w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-250 text-left',
            activeItem === item.name
              ? 'bg-gray-50 text-gray-950 font-semibold' 
              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50/50'
          ]"
        >
          <component 
            :is="item.icon" 
            :size="18" 
            :stroke-width="activeItem === item.name ? 2.2 : 1.8"
          />
          {{ item.name }}
        </button>
        
      </nav>
    </div>
<div class="pt-4 border-t border-red-500">
      <button 
        @click="handleReset"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
      >
        <Trash2 :size="14" />
        Rensa Cache
      </button>
    </div>
  </aside>
</template>