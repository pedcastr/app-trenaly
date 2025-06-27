// Serviço para contornar CORS na web
class WebProxyService {
  static async fetchWithProxy(url) {
    if (typeof window !== 'undefined') {
      // Estamos na web - usar proxy CORS
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      
      try {
        const response = await fetch(proxyUrl, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          }
        });
        return response;
      } catch (error) {
        // Fallback para outro proxy
        const fallbackProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const fallbackResponse = await fetch(fallbackProxy);
        const data = await fallbackResponse.json();
        
        return {
          ok: fallbackResponse.ok,
          json: async () => JSON.parse(data.contents)
        };
      }
    } else {
      // Mobile - fetch normal
      return fetch(url);
    }
  }
}

export default WebProxyService;