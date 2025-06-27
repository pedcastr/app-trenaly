import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl, getUserDisplayName } from '../../utils/avatarUtils';
import { styles } from './styles';

export default function Search({ navigation }) {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' ou 'posts'

  useEffect(() => {
    if (searchText.length > 2) {
      searchData();
    } else {
      setUsers([]);
      setPosts([]);
    }
  }, [searchText, activeTab]);

  const searchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        await searchUsers();
      } else {
        await searchPosts();
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('nomePreferido', '>=', searchText),
        where('nomePreferido', '<=', searchText + '\uf8ff'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const usersData = [];
      
      querySnapshot.forEach((doc) => {
        if (doc.id !== user.uid) { // Não mostrar o próprio usuário
          usersData.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const searchPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        where('content', '>=', searchText),
        where('content', '<=', searchText + '\uf8ff'),
        orderBy('content'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const postsData = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const postData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // Buscar dados do usuário
        try {
          const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', postData.userId)));
          if (!userDoc.empty) {
            postData.userData = userDoc.docs[0].data();
          }
        } catch (userError) {
          console.error('Erro ao buscar dados do usuário:', userError);
        }
        
        postsData.push(postData);
      }
      
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
      <Image 
        source={{ uri: getAvatarUrl(item, { uid: item.id }) }}
        style={styles.userAvatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{getUserDisplayName(item, { uid: item.id })}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <View style={styles.postHeader}>
        <Image 
          source={{ uri: getAvatarUrl(item.userData, { uid: item.userId }) }}
          style={styles.postUserAvatar}
        />
        <View style={styles.postUserInfo}>
          <Text style={styles.postUserName}>
            {getUserDisplayName(item.userData, { uid: item.userId })}
          </Text>
        </View>
      </View>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.content}
      </Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuários ou posts..."
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchText.length > 2 && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.activeTab]}
            onPress={() => setActiveTab('users')}
          >
            <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
              Usuários
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#276999" />
          </View>
        ) : searchText.length <= 2 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Digite pelo menos 3 caracteres para buscar</Text>
          </View>
        ) : (
          <FlatList
            data={activeTab === 'users' ? users : posts}
            renderItem={activeTab === 'users' ? renderUser : renderPost}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  Nenhum {activeTab === 'users' ? 'usuário' : 'post'} encontrado
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
