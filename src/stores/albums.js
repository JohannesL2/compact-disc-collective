import { defineStore } from 'pinia'

export const useAlbumStore = defineStore('albums', {
  state: () => ({
    trendingIds: [11650, 31359637, 4587655, 19696420],
    cachedAlbums: {}, // Save data
    trendingList: [],
    loading: false
  }),
  actions: {
    async fetchTrending() {
      if (this.trendingList.length > 0) return // Cache already loaded
      this.loading = true
      
      try {
        const promises = this.trendingIds.map(async (id) => {
          // Check if cd is already cached
          if (this.cachedAlbums[id]) return this.cachedAlbums[id]
          
          const res = await fetch(`https://api.discogs.com/releases/${id}`, {
            headers: { 
              // Discogs need user-agent id to accept fetch requests
              'User-Agent': 'CompactDiscCollectivePortfolio/1.0' 
            }
          })
          
          if (!res.ok) throw new Error(`Kunde inte hämta ID ${id}`)
          const data = await res.json()
          
          // Format data to look better
          const formatted = {
            id: data.id,
            artist: data.artists?.[0]?.name || 'Okänd Artist',
            title: data.title,
            // Data.thumb doesn't need any login
            cover: data.thumb || 'https://via.placeholder.com/300', 
            // If price doesn't exist we put 15 SEK as standard value
            price: Math.round((data.lowest_price || 15) * 11.5) 
          }
          
          this.cachedAlbums[id] = formatted
          return formatted
        })
        
        this.trendingList = await Promise.all(promises)
      } catch (err) {
        console.error("Fel vid hämtning:", err)
      } finally {
        this.loading = false
      }
    },

    clearCache() {
      this.cachedAlbums = {}
      this.trendingList = []
      console.log('Cachen har rensats!')
    }
  }
})