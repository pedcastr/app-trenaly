import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import { getAvatarUrl, getUserDisplayName } from '../../utils/avatarUtils';
import { styles } from './styles';

export default function Profile({ navigation }) {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userPosts = await socialService.getUserPosts(user.uid);
      setPosts(userPosts);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
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
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>
            {getUserDisplayName(userData, user)}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: getAvatarUrl(userData, user) }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {getUserDisplayName(userData, user)}
          </Text>

          {userData?.bio && (
            <Text style={styles.userBio}>{userData.bio}</Text>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Publicações</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'grid' && styles.activeViewButton]}
              onPress={() => setViewMode('grid')}
            >
              <Ionicons name="grid-outline" size={20} color={viewMode === 'grid' ? '#276999' : '#666'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list-outline" size={20} color={viewMode === 'list' ? '#276999' : '#666'} />
            </TouchableOpacity>
          </View>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="camera-outline" size={80} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Nenhuma publicação ainda</Text>
            <Text style={styles.emptyStateSubtitle}>
              Compartilhe seus momentos criando sua primeira publicação
            </Text>
            <TouchableOpacity
              style={styles.createPostButton}
              onPress={() => navigation.navigate('CreatePost')}
            >
              <Text style={styles.createPostButtonText}>Criar Publicação</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={viewMode === 'grid' ? styles.postsGrid : styles.postsList}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
                onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
              >
                {viewMode === 'grid' ? (
                  post.imageUrl ? (
                    <Image source={{ uri: post.imageUrl }} style={styles.gridImage} />
                  ) : (
                    <View style={styles.gridPlaceholder}>
                      <Text style={styles.gridPlaceholderText} numberOfLines={3}>
                        {post.content}
                      </Text>
                    </View>
                  )
                ) : (
                  <View style={styles.listItemContent}>
                    {post.imageUrl && (
                      <Image source={{ uri: post.imageUrl }} style={styles.listImage} />
                    )}
                    <View style={styles.listTextContent}>
                      <Text style={styles.listPostContent} numberOfLines={2}>
                        {post.content}
                      </Text>
                      <Text style={styles.listPostDate}>
                        {post.createdAt ?
                          new Date(post.createdAt.toDate()).toLocaleDateString('pt-BR') :
                          'Hoje'
                        }
                      </Text>
                      <View style={styles.listPostStats}>
                        <Text style={styles.listPostStat}>
                          {post.likes?.length || 0} curtidas
                        </Text>
                        <Text style={styles.listPostStat}>
                          {post.comments?.length || 0} comentários
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

