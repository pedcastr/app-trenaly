import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl, getUserDisplayName } from '../../utils/avatarUtils';
import { styles } from './styles';

export default function Chat({ navigation }) {
  const { user, userData } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Por enquanto, dados mockados
    setConversations([
      {
        id: '1',
        otherUser: {
          id: 'user1',
          nomePreferido: 'João Silva',
          fotoPerfil: null,
        },
        lastMessage: 'Oi, como vai o treino?',
        lastMessageTime: new Date(),
        unreadCount: 2,
      },
      {
        id: '2',
        otherUser: {
          id: 'user2',
          nomePreferido: 'Maria Santos',
          fotoPerfil: null,
        },
        lastMessage: 'Vamos treinar juntos amanhã?',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 0,
      },
    ]);
  }, []);

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return messageTime.toLocaleDateString('pt-BR');
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigation.navigate('ChatRoom', { 
        conversationId: item.id,
        otherUser: item.otherUser 
      })}
    >
      <Image 
        source={{ uri: getAvatarUrl(item.otherUser, { uid: item.otherUser.id }) }}
        style={styles.userAvatar}
      />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>
            {getUserDisplayName(item.otherUser, { uid: item.otherUser.id })}
          </Text>
          <Text style={styles.messageTime}>
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>
        <View style={styles.messagePreview}>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
          <Ionicons name="create-outline" size={24} color="#276999" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma conversa ainda</Text>
            <Text style={styles.emptySubtext}>
              Comece uma conversa com outros usuários
            </Text>
          </View>
        }
      />
    </View>
  );
}