import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import { getUserDisplayName } from '../../utils/avatarUtils';
import UserAvatar from '../../components/UserAvatar';
import { styles } from './styles';

export default function Comments({ navigation, route }) {
  const { postId, postUsersData = {} } = route.params; // Receber dados dos usuários
  const { user, userData } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [commentUsersData, setCommentUsersData] = useState({}); // Cache para usuários dos comentários

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const commentsData = await socialService.getComments(postId);
      setComments(commentsData);
      
      // Carregar dados dos usuários dos comentários
      const commentUserIds = commentsData
        .map(comment => comment.userId)
        .filter(userId => userId !== user?.uid && !postUsersData[userId]); // Não carregar se já temos os dados
      
      const uniqueCommentUserIds = [...new Set(commentUserIds)]; // Remover duplicatas
      const commentUsersDataMap = {};
      
      for (const userId of uniqueCommentUserIds) {
        try {
          const userData = await socialService.getUserData(userId);
          if (userData) {
            commentUsersDataMap[userId] = userData;
          }
        } catch (error) {
          console.error(`Erro ao carregar dados do usuário ${userId}:`, error);
        }
      }
      
      setCommentUsersData(commentUsersDataMap);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os comentários');
    } finally {
      setLoading(false);
    }
  };

  const sendComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSending(true);
      
      const commentData = {
        userId: user.uid,
        content: newComment.trim(),
      };
      
      const commentId = await socialService.addComment(postId, commentData);
      
      // Adicionar o comentário à lista local
      const newCommentObj = {
        id: commentId,
        ...commentData,
        postId,
        createdAt: new Date(),
      };
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      Alert.alert('Erro', 'Não foi possível enviar o comentário. Verifique sua conexão e tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const getCommentUserName = (userId) => {
    if (userId === user?.uid) {
      return getUserDisplayName(userData, user);
    }
    
    // Primeiro verificar nos dados dos posts
    if (postUsersData[userId]) {
      return getUserDisplayName(postUsersData[userId], { uid: userId });
    }
    
    // Depois verificar nos dados dos comentários
    if (commentUsersData[userId]) {
      return getUserDisplayName(commentUsersData[userId], { uid: userId });
    }
    
    return `User ${userId.slice(-4)}`;
  };

  const getCommentUserData = (userId) => {
    if (userId === user?.uid) {
      return userData;
    }
    
    // Primeiro verificar nos dados dos posts
    if (postUsersData[userId]) {
      return postUsersData[userId];
    }
    
    // Depois verificar nos dados dos comentários
    if (commentUsersData[userId]) {
      return commentUsersData[userId];
    }
    
    return null;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Agora';
    
    const now = new Date();
    const commentTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <UserAvatar 
        userId={item.userId}
        userData={getCommentUserData(item.userId)}
        user={item.userId === user?.uid ? user : null}
        size={32}
        style={styles.commentUserImage}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentUserName}>
            {getCommentUserName(item.userId)}
          </Text>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
        <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#276999" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comentários</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}
        inverted
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Seja o primeiro a comentar!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <UserAvatar 
          userId={user.uid}
          userData={userData}
          user={user}
          size={32}
          style={styles.userImage}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Adicione um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!newComment.trim() || sending) && styles.sendButtonDisabled
            ]}
            onPress={sendComment}
            disabled={!newComment.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#276999" />
            ) : (
              <Ionicons 
                name="send" 
                size={20} 
                color={newComment.trim() && !sending ? "#276999" : "#ccc"} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
