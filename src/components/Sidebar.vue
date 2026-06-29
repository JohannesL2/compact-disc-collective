<script setup>
import { ref } from 'vue'
import { useAlbumStore } from '../stores/Albums'
//Import modern icons
import { 
  Compass,      // "Explore"
  Disc,         // "My Collection"
  Heart,        // "Wishlist"
  BarChart2,     // "Analytics"
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-vue-next'

const albumStore = useAlbumStore()
// Check which menuitem is active
const activeItem = ref('Explore')

const isCollapsed = ref(false)

const mobileIsOpen = ref(false)

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
  <div class="md:hidden w-full h-16 bg-white border-b border-gray-100 fixed top-0 left-0 z-40 px-6 flex items-center justify-between select-none">
    <div class="flex items-center gap-3">
      <div class="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
      </div>
      <span class="text-sm font-bold text-gray-900 tracking-tight">CD Collective</span>
    </div>
    
    <button 
      @click="mobileIsOpen = true" 
      class="p-2 -mr-2 rounded-xl hover:bg-gray-50 text-gray-700 active:bg-gray-100 cursor-pointer"
    >
      <Menu :size="20" />
    </button>
  </div>

  <div 
    v-if="mobileIsOpen"
    @click="mobileIsOpen = false"
    class="md:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-opacity duration-300"
  ></div>
  <aside 
    :class="[
      'h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-6 fixed top-0 left-0 z-50 select-none transition-all duration-300',
      mobileIsOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
      'md:translate-x-0',
      isCollapsed ? 'md:w-20' : 'md:w-64'
    ]"
  >
    <div>
      <div 
        :class="[
          'flex items-center justify-between mb-12 transition-all duration-300',
          isCollapsed ? 'md:flex-col md:items-center md:gap-4' : 'md:flex-row'
        ]"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-8 h-8 shrink-0 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-xs tracking-tighter">
            <div class="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>
          <h1 :class="['text-base font-bold text-gray-900 leading-tight tracking-tight whitespace-nowrap md:block', isCollapsed ? 'md:hidden' : '']">
            Compact Disc<br>
            <span class="text-gray-500 font-medium">Collective</span>
          </h1>
        </div>


        <div>
          <button 
            @click="mobileIsOpen = false"
            class="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X :size="18" />
          </button>
        <button 
  @click="isCollapsed = !isCollapsed"
  class="hidden md:block p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
>
          <component :is="isCollapsed ? ChevronRight : ChevronLeft" :size="18" />
        </button>
      </div>
    </div>
      <nav class="space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.name"
          @click="activeItem = item.name"
          :class="[
            'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-250 text-left cursor-pointer',
            isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3',
            activeItem === item.name
              ? 'bg-gray-50 text-gray-950 font-semibold' 
              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50/50'
          ]"
          :title="isCollapsed ? item.name : ''"
        >
          <component 
            :is="item.icon" 
            :size="18" 
            :stroke-width="activeItem === item.name ? 2.2 : 1.8"
            class="shrink-0"
          />
          <span :class="['md:block whitespace-nowrap', isCollapsed ? 'md:hidden' : '']">
  {{ item.name }}
</span>
        </button>
      </nav>
    </div>

    <div class="pt-4 border-t border-zinc-100">
      <button 
        @click="handleReset"
        :class="[
          'w-full flex items-center text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl font-bold uppercase tracking-wider transition-all duration-200',
          isCollapsed ? 'justify-center p-3 text-sm' : 'justify-center gap-2 px-4 py-3 text-xs'
        ]"
        :title="isCollapsed ? 'Clear Cache' : ''"
      >
        <Trash2 :size="14" class="shrink-0" />
        <span :class="['md:block whitespace-nowrap', isCollapsed ? 'md:hidden' : '']">
  Clear Cache
</span>
      </button>
    </div>
  </aside>
</template>