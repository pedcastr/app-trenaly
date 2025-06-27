import React, { useState, useEffect } from 'react';
import { Image, View, Text } from 'react-native';
import { socialService } from '../services/socialService';
import { getAvatarUrlSync } from '../utils/avatarUtils';

export default function UserAvatar({ userId, userData, user, style, size = 40 }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userInfo, setUserInfo] = useState(userData);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let finalUserData = userData;
        
        // Se não temos userData, buscar do Firestore
        if (!finalUserData && userId) {
          finalUserData = await socialService.getUserData(userId);
        }
        
        setUserInfo(finalUserData);
        
        // Gerar URL do avatar
        const url = getAvatarUrlSync(finalUserData, user || { uid: userId });
        setAvatarUrl(url);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Fallback para avatar padrão
        const fallbackUrl = getAvatarUrlSync(null, { uid: userId || 'unknown' });
        setAvatarUrl(fallbackUrl);
      }
    };

    loadUserData();
  }, [userId, userData, user]);

  if (!avatarUrl) {
    return (
      <View style={[{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
      }, style]}>
        <Text style={{ color: '#999', fontSize: size / 3 }}>?</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: avatarUrl }}
      style={[{
        width: size,
        height: size,
        borderRadius: size / 2,
      }, style]}
      onError={() => {
        // Em caso de erro, usar avatar com iniciais
        const fallbackUrl = getAvatarUrlSync(userInfo, { uid: userId || 'unknown' });
        setAvatarUrl(fallbackUrl);
      }}
    />
  );
}
