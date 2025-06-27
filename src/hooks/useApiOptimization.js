import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import YouTubeService from '../services/youtubeService';
import PlacesService from '../services/placesService';

export const useApiOptimization = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App voltou ao foreground - limpar caches expirados
        console.log('🧹 Limpando caches expirados...');
        YouTubeService.clearExpiredCache();
        PlacesService.clearExpiredCache();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Função para monitorar uso das APIs
  const getApiUsageStats = () => {
    return {
      youtube: YouTubeService.getCacheStats(),
      places: PlacesService.getCacheStats?.() || { totalCached: 0, cacheKeys: [] }
    };
  };

  return {
    getApiUsageStats
  };
};