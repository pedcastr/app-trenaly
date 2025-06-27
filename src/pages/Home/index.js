import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import { getUserDisplayName } from '../../utils/avatarUtils';
import UserAvatar from '../../components/UserAvatar';
import { styles } from './styles';

export default function Home({ navigation }) {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storyUsersData, setStoryUsersData] = useState({});
  const [postUsersData, setPostUsersData] = useState({}); // Adicionar cache para usuários dos posts

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      setLoading(true);
      const [feedPosts, feedStories] = await Promise.all([
        socialService.getFeedPosts(),
        socialService.getStories()
      ]);
      
      // Garantir que posts tenham a estrutura correta
      const postsWithDefaults = feedPosts.map(post => ({
        ...post,
        likes: post.likes || [], // Garantir que likes seja sempre um array
        comments: post.comments || [],
      }));
      
      setPosts(postsWithDefaults);
      setStories(feedStories);
      
      // Carregar dados dos usuários dos stories
      const storyUserIds = Object.keys(feedStories).filter(userId => userId !== user?.uid);
      const storyUsersDataMap = {};
      
      for (const userId of storyUserIds) {
        try {
          const userData = await socialService.getUserData(userId);
          if (userData) {
            storyUsersDataMap[userId] = userData;
          }
        } catch (error) {
          console.error(`Erro ao carregar dados do usuário ${userId}:`, error);
        }
      }
      
      setStoryUsersData(storyUsersDataMap);
      
      // Carregar dados dos usuários dos posts
      const postUserIds = postsWithDefaults
        .map(post => post.userId)
        .filter(userId => userId !== user?.uid);
      
      const uniquePostUserIds = [...new Set(postUserIds)]; // Remover duplicatas
      const postUsersDataMap = {};
      
      for (const userId of uniquePostUserIds) {
        try {
          const userData = await socialService.getUserData(userId);
          if (userData) {
            postUsersDataMap[userId] = userData;
          }
        } catch (error) {
          console.error(`Erro ao carregar dados do usuário ${userId}:`, error);
        }
      }
      
      setPostUsersData(postUsersDataMap);
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedData();
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    try {
      await socialService.toggleLike(postId, user.uid);
      // Atualizar o estado local
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const likes = post.likes || [];
            const isLiked = likes.includes(user.uid);
            return {
              ...post,
              likes: isLiked 
                ? likes.filter(uid => uid !== user.uid)
                : [...likes, user.uid]
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const getStoryUserName = (userId) => {
    if (userId === user?.uid) {
      return 'Seu story';
    }
    
    const userData = storyUsersData[userId];
    if (userData) {
      return getUserDisplayName(userData, { uid: userId });
    }
    
    return `User ${userId.slice(-4)}`;
  };

  const getPostUserName = (userId) => {
    if (userId === user?.uid) {
      return getUserDisplayName(userData, user);
    }
    
    const userInfo = postUsersData[userId];
    if (userInfo) {
      return getUserDisplayName(userInfo, { uid: userId });
    }
    
    return `User ${userId.slice(-4)}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#276999" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Trenaly</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => console.log('Chat em desenvolvimento')}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stories */}
        <View style={styles.storiesContainer}>
          <Text style={styles.sectionTitle}>Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            <TouchableOpacity 
              style={styles.addStoryButton}
              onPress={() => navigation.navigate('CreateStory')}
            >
              <View style={styles.addStoryCircle}>
                <Ionicons name="add" size={24} color="#276999" />
              </View>
              <Text style={styles.storyText}>Seu story</Text>
            </TouchableOpacity>
            
            {Object.entries(stories).map(([userId, userStories]) => (
              <TouchableOpacity 
                key={userId}
                style={styles.storyItem}
                onPress={() => navigation.navigate('ViewStory', { 
                  stories: userStories, 
                  userId,
                  userName: getStoryUserName(userId) // Passar o nome para o ViewStory
                })}
              >
                <View style={[styles.storyCircle, styles.storyCircleWithStory]}>
                  <UserAvatar 
                    userId={userId}
                    userData={userId === user?.uid ? userData : storyUsersData[userId]}
                    user={userId === user?.uid ? user : null}
                    size={60}
                    style={styles.storyImage}
                  />
                </View>
                <Text style={styles.storyText}>
                  {getStoryUserName(userId)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts Feed */}
        <View style={styles.feedContainer}>
          {posts.length === 0 ? (
            <View style={styles.emptyFeed}>
              <Ionicons name="camera-outline" size={64} color="#ccc" />
              <Text style={styles.emptyFeedTitle}>Nenhum post ainda</Text>
              <Text style={styles.emptyFeedText}>
                Seja o primeiro a compartilhar algo!
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postUserContainer}>
                    <UserAvatar 
                      userId={post.userId}
                      userData={post.userId === user?.uid ? userData : postUsersData[post.userId]}
                      user={post.userId === user?.uid ? user : null}
                      size={40}
                      style={styles.postUserImage}
                    />
                    <View style={styles.postUserInfo}>
                      <Text style={styles.postUserName}>
                        {getPostUserName(post.userId)}
                      </Text>
                      <Text style={styles.postTime}>
                        {post.createdAt ? 
                          new Date(post.createdAt.toDate()).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Agora'
                        }
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                
                {post.imageUrl && (
                  <Image 
                    source={{ uri: post.imageUrl }}
                    style={styles.postImage}
                    onError={(error) => console.log('Erro ao carregar imagem:', error)}
                  />
                )}
                
                <View style={styles.postActions}>
                  <View style={styles.postActionsLeft}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleLike(post.id)}
                    >
                      <Ionicons 
                        name={(post.likes || []).includes(user.uid) ? "heart" : "heart-outline"} 
                        size={24} 
                        color={(post.likes || []).includes(user.uid) ? "#ff3040" : "#333"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => navigation.navigate('Comments', { 
                        postId: post.id,
                        postUsersData: postUsersData // Passar dados dos usuários para Comments
                      })}
                    >
                      <Ionicons name="chatbubble-outline" size={22} color="#333" />
                    </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="paper-plane-outline" size={22} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={22} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.postContent}>
                  <Text style={styles.postLikes}>
                    {(post.likes || []).length} {(post.likes || []).length === 1 ? 'curtida' : 'curtidas'}
                  </Text>
                  {post.content && (
                    <Text style={styles.postDescription}>
                      <Text style={styles.postUserNameBold}>
                        {getPostUserName(post.userId)}
                      </Text> {post.content}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

