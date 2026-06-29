import { defineStore } from 'pinia'


const cleanArtistName = (name) => {
  return name.replace(/\s*\(\d+\)$/, '').trim()
}

export const useAlbumStore = defineStore('albums', {
  state: () => ({
    trendingIds: [11650, 4572672, 17467951, 19676596],
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
          const data = await res.json();

          let previewUrl = null
          try {
            const cleanArtist = cleanArtistName(data.artists?.[0]?.name || '')
            const searchTerms = encodeURIComponent(`${cleanArtist} ${data.title}`)
            const iTunesRes = await fetch(`https://itunes.apple.com/search?term=${searchTerms}&entity=song&limit=1`)
            if (iTunesRes.ok) {
              const iTunesData = await iTunesRes.json()
              previewUrl = iTunesData.results?.[0]?.previewUrl || null
            }
          } catch (e) {
            console.error("Kunde inte hämta iTunes-preview:", e)
          }
          // ----------------------------------
          
          // Format data to look better
          const formatted = {
            id: data.id,
            artist: cleanArtistName(data.artists?.[0]?.name || 'Okänd Artist'), // Ändrad för snyggare namn
            title: data.title,
            cover: data.thumb || 'https://via.placeholder.com/300', 
            price: Math.round((data.lowest_price || 15) * 11.5),
            preview: previewUrl
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