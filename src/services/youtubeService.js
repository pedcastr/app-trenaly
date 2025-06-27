import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

class YouTubeService {
  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.youtubeApiKey ||
      Constants.manifest?.extra?.youtubeApiKey ||
      process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    this.cachePrefix = 'youtube_cache_';
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
  }

  async searchExerciseVideos(exerciseName, maxResults = 5) {
    if (!this.apiKey) {
      console.warn('⚠️ YouTube API key não configurada');
      return this.getMockVideos(exerciseName);
    }

    const cacheKey = `${this.cachePrefix}${exerciseName.toLowerCase().replace(/\s+/g, '_')}`;

    try {
      const cached = await this.getCachedData(cacheKey);
      if (cached) {
        console.log('📦 Usando cache do YouTube para:', exerciseName);
        return cached;
      }

      console.log('🔍 Buscando vídeos para:', exerciseName);

      const searchQuery = `${exerciseName} exercício como fazer`;
      const url = `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${this.apiKey}&regionCode=BR&relevanceLanguage=pt`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`YouTube API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`YouTube API Error: ${data.error.code} - ${data.error.message}`);
      }

      const videos = data.items?.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      })) || [];

      await this.setCachedData(cacheKey, videos);

      console.log(`✅ ${videos.length} vídeos encontrados para: ${exerciseName}`);
      return videos;

    } catch (error) {
      console.error('❌ Erro ao buscar vídeos:', error);

      const expiredCache = await this.getCachedData(cacheKey, true);
      if (expiredCache) {
        console.log('📦 Usando cache expirado como fallback');
        return expiredCache;
      }

      return this.getMockVideos(exerciseName);
    }
  }

  getMockVideos(exerciseName) {
    console.log('📺 Usando vídeos mock para:', exerciseName);
    return [
      {
        id: 'dQw4w9WgXcQ',
        title: `Como fazer ${exerciseName} - Tutorial Completo`,
        description: `Aprenda a executar o exercício ${exerciseName} com a técnica correta. Este vídeo mostra a forma adequada, músculos trabalhados e dicas importantes.`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        channelTitle: 'Trenaly Fitness',
        publishedAt: new Date().toISOString()
      }
    ];
  }

  async getCachedData(key, ignoreExpiry = false) {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (!ignoreExpiry && (now - timestamp) > this.cacheExpiry) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return null;
    }
  }

  async setCachedData(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  async getCacheStats() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const youtubeKeys = keys.filter(key => key.startsWith(this.cachePrefix));

      let totalCached = 0;
      const cacheKeys = [];

      for (const key of youtubeKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          totalCached++;
          cacheKeys.push(key.replace(this.cachePrefix, ''));
        }
      }

      return {
        totalCached,
        cacheKeys,
        service: 'YouTube'
      };
    } catch (error) {
      console.error('Erro ao obter stats do cache:', error);
      return {
        totalCached: 0,
        cacheKeys: [],
        service: 'YouTube'
      };
    }
  }

  async clearExpiredCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const youtubeKeys = keys.filter(key => key.startsWith(this.cachePrefix));

      for (const key of youtubeKeys) {
        const cached = await this.getCachedData(key);
        if (!cached) {
          // Já foi removido por estar expirado
          continue;
        }
      }

      console.log('🧹 Cache do YouTube limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }
}

export default new YouTubeService();
