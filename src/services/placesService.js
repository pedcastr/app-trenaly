import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PlacesService {
  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.googlePlacesApiKey ||
      Constants.manifest?.extra?.googlePlacesApiKey ||
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    this.cachePrefix = 'places_cache_';
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutos
  }

  async searchNearbyPlaces(latitude, longitude, type = 'gym', radius = 5000) {
    if (!this.apiKey) {
      console.warn('⚠️ Google Places API key não configurada');
      return this.getMockPlaces(type);
    }

    const cacheKey = `${this.cachePrefix}${latitude}_${longitude}_${type}_${radius}`;

    try {
      const cached = await this.getCachedData(cacheKey);
      if (cached) {
        console.log('📦 Usando cache do Places para:', type);
        return cached;
      }

      console.log('🔍 Buscando locais próximos...');

      const url = `${this.baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${this.apiKey}&language=pt-BR`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Places API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Places API Error: ${data.error.code} - ${data.error.message}`);
      }

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Places API Status: ${data.status}`);
      }

      const places = data.results?.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        rating: place.rating || 0,
        isOpen: place.opening_hours?.open_now ?? null,
        phone: place.formatted_phone_number || null,
        distance: this.calculateDistance(
          latitude, longitude,
          place.geometry.location.lat, place.geometry.location.lng
        ).toFixed(1),
        photos: place.photos || [],
        types: place.types || []
      })) || [];

      places.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      await this.setCachedData(cacheKey, places);

      console.log(`✅ ${places.length} locais encontrados`);
      return places;

    } catch (error) {
      console.error('❌ Erro ao buscar locais:', error);

      const expiredCache = await this.getCachedData(cacheKey, true);
      if (expiredCache) {
        console.log('📦 Usando cache expirado como fallback');
        return expiredCache;
      }

      return this.getMockPlaces(type);
    }
  }

  async getPlaceDetails(placeId) {
    if (!this.apiKey || !placeId) {
      console.warn('⚠️ API key ou placeId não disponível, usando dados mock');
      return this.getMockPlaceDetails();
    }

    const cacheKey = `${this.cachePrefix}details_${placeId}`;

    try {
      const cached = await this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,reviews&key=${this.apiKey}&language=pt-BR`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Places Details API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Places Details API Status: ${data.status}`);
      }

      const details = data.result;
      await this.setCachedData(cacheKey, details);

      return details;

    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do local:', error);
      return this.getMockPlaceDetails();
    }
  }

  getMockPlaceDetails() {
    return {
      name: 'Local Exemplo',
      formatted_address: 'Endereço exemplo',
      formatted_phone_number: '(11) 99999-9999',
      rating: 4.5,
      opening_hours: {
        weekday_text: [
          'Segunda-feira: 06:00–22:00',
          'Terça-feira: 06:00–22:00',
          'Quarta-feira: 06:00–22:00',
          'Quinta-feira: 06:00–22:00',
          'Sexta-feira: 06:00–22:00',
          'Sábado: 08:00–20:00',
          'Domingo: 08:00–18:00'
        ]
      },
      reviews: [
        {
          author_name: 'João Silva',
          rating: 5,
          text: 'Excelente local! Muito bem equipado e com ótimo atendimento.',
          relative_time_description: 'há 2 semanas'
        },
        {
          author_name: 'Maria Santos',
          rating: 4,
          text: 'Bom local para treinar, ambiente limpo e organizado.',
          relative_time_description: 'há 1 mês'
        }
      ]
    };
  }

  getMockPlaces(type) {
    console.log('📍 Usando locais mock para:', type);
    const mockData = {
      gym: [
        {
          id: 'mock_1',
          name: 'Smart Fit',
          address: 'Rua das Flores, 123 - Centro',
          distance: '0.5',
          rating: 4.2,
          isOpen: true,
          phone: '(11) 99999-9999',
          location: { lat: -23.5505, lng: -46.6333 }
        },
        {
          id: 'mock_2',
          name: 'Bio Ritmo',
          address: 'Av. Principal, 456 - Jardins',
          distance: '1.2',
          rating: 4.5,
          isOpen: true,
          phone: '(11) 88888-8888',
          location: { lat: -23.5515, lng: -46.6343 }
        },
        {
          id: 'mock_3',
          name: 'Academia Corpo e Mente',
          address: 'Rua da Saúde, 789 - Vila Nova',
          distance: '2.1',
          rating: 4.0,
          isOpen: false,
          phone: '(11) 77777-7777',
          location: { lat: -23.5525, lng: -46.6353 }
        }
      ],
      park: [
        {
          id: 'mock_4',
          name: 'Parque da Cidade',
          address: 'Av. dos Parques, s/n - Centro',
          distance: '0.8',
          rating: 4.7,
          isOpen: true,
          phone: '(11) 3333-4444',
          location: { lat: -23.5535, lng: -46.6363 }
        },
        {
          id: 'mock_5',
          name: 'Praça da Liberdade',
          address: 'Praça da Liberdade - Liberdade',
          distance: '1.5',
          rating: 4.3,
          isOpen: true,
          phone: '(11) 2222-3333',
          location: { lat: -23.5545, lng: -46.6373 }
        }
      ]
    };
    return mockData[type] || [];
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
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
      const placesKeys = keys.filter(key => key.startsWith(this.cachePrefix));

      let totalCached = 0;
      const cacheKeys = [];

      for (const key of placesKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          totalCached++;
          cacheKeys.push(key.replace(this.cachePrefix, ''));
        }
      }

      return {
        totalCached,
        cacheKeys,
        service: 'Places'
      };
    } catch (error) {
      console.error('Erro ao obter stats do cache:', error);
      return {
        totalCached: 0,
        cacheKeys: [],
        service: 'Places'
      };
    }
  }

  async clearExpiredCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const placesKeys = keys.filter(key => key.startsWith(this.cachePrefix));

      for (const key of placesKeys) {
        const cached = await this.getCachedData(key);
        if (!cached) {
          continue;
        }
      }

      console.log('🧹 Cache do Places limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }
}

export default new PlacesService();

