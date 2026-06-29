<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  album: {
    type: Object,
    required: true
  }
})

const isPlaying = ref(false)

// --- GLOBAL MUSICPLAYER ---
const getGlobalAudio = () => {
  if (typeof window === 'undefined') return null
  if (!window.__cdPlayer) {
    window.__cdPlayer = {
      audio: new Audio(),
      currentPlayingRef: null,
      fadeInterval: null
    }
  }
  return window.__cdPlayer
}

//Function for fading out music
const fadeOutAndStop = (player, callback) => {
  clearInterval(player.fadeInterval)
  
  let volume = player.audio.volume
  
  player.fadeInterval = setInterval(() => {
    volume -= 0.1
    if (volume > 0) {
      player.audio.volume = volume
    } else {
      clearInterval(player.fadeInterval)
      player.audio.pause()
      player.audio.volume = 1 // Reset volume
      if (callback) callback()
    }
  }, 30) // 300 milliseconds fade out
}

const togglePreview = () => {
  const player = getGlobalAudio()
  if (!player || !props.album.preview) {
    console.warn(`Ingen preview-länk tillgänglig för ${props.album.title}`)
    return
  }

  if (isPlaying.value) {
    fadeOutAndStop(player, () => {
      isPlaying.value = false
      player.currentPlayingRef = null
    })
    return
  }

  if (player.currentPlayingRef && player.currentPlayingRef !== isPlaying) {
    const oldRef = player.currentPlayingRef
    
    fadeOutAndStop(player, () => {
      oldRef.value = false
      startNewTrack(player)
    })
  } else {
    startNewTrack(player)
  }
}

const handleMobileCoverClick = () => {
  if (window.innerWidth < 768) {
    togglePreview()
  }
}

const startNewTrack = (player) => {
  clearInterval(player.fadeInterval)
  player.audio.volume = 1
  player.audio.src = props.album.preview
  player.audio.play()
  
  isPlaying.value = true
  player.currentPlayingRef = isPlaying

  player.audio.onended = () => {
    isPlaying.value = false
    if (player.currentPlayingRef === isPlaying) {
      player.currentPlayingRef = null
    }
  }
}



onBeforeUnmount(() => {
  const player = getGlobalAudio()
  if (player && player.currentPlayingRef === isPlaying) {
    clearInterval(player.fadeInterval)
    player.audio.pause()
    player.currentPlayingRef = null
  }
})
</script>

<template>
  <div class="group relative w-64 cursor-pointer">

    <div 
      @click="handleMobileCoverClick"
      class="relative w-48 h-48 z-10 shadow-lg bg-white rounded-sm cursor-pointer"
    >
      <!-- Jewelcase front -->
      <img :src="album.cover" class="w-full h-full object-cover z-20 relative rounded-sm shadow-md" />
      
      <!-- CD-disc showing on hover -->
      <div 
        @click.stop="togglePreview"
        :class="[
          'absolute top-2 w-44 h-44 left-6 rounded-full bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-inner transform transition-transform duration-500 z-0 flex items-center justify-center overflow-hidden pointer-events-none md:pointer-events-auto',
          isPlaying ? 'translate-x-20 animate-[spin_4s_linear_infinite]' : 'group-hover:translate-x-20'
        ]"
      >
        <!-- Album cover for the cd -->
        <img 
          :src="album.cover" 
          class="absolute inset-0 w-full h-full object-cover rounded-full opacity-60 mix-blend-luminosity scale-105" 
        />
        
        <!-- Gradient to make it look more like a real cd -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-black/10 pointer-events-none"></div>

        <!-- Hole overlay for cd disc -->
        <div class="w-12 h-12 rounded-full bg-white border border-gray-200/80 flex items-center justify-center z-10 shadow-sm">
          <div class="w-4 h-4 rounded-full bg-transparent border border-gray-300">
            <div class="text-[10px] text-gray-400 font-bold select-none text-center leading-4">
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6">
      <h3 class="font-bold text-gray-900 text-sm m-0">{{ album.artist }}</h3>
      <p class="text-gray-500 text-sm m-0">{{ album.title }}</p>
      <div class="mt-4 flex items-baseline gap-2">
        <span class="text-xs text-gray-400 uppercase tracking-wider">Value</span>
        <span class="text-sm font-bold text-gray-900">{{ album.price }} SEK</span>
      </div>
    </div>
  </div>
</template>