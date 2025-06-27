import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import { getUserDisplayName } from '../../utils/avatarUtils';
import UserAvatar from '../../components/UserAvatar';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

export default function ViewStory({ navigation, route }) {
  const { stories, userId } = route.params;
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [storyUserData, setStoryUserData] = useState(null);

  useEffect(() => {
    loadStoryUserData();
  }, [userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            navigation.goBack();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, stories.length, navigation]);

  const loadStoryUserData = async () => {
    try {
      if (userId === user?.uid) {
        // Se é o próprio usuário, não precisa buscar
        return;
      }
      
      const userData = await socialService.getUserData(userId);
      setStoryUserData(userData);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário do story:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const getDisplayName = () => {
    if (userId === user?.uid) {
      return 'Você';
    }
    
    if (storyUserData) {
      return getUserDisplayName(storyUserData, { uid: userId });
    }
    
    return `User ${userId.slice(-4)}`;
  };

  const currentStory = stories[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Progress bars */}
      <View style={styles.progressContainer}>
        {stories.map((_, index) => (
          <View key={index} style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBar,
                {
                  width: index < currentIndex ? '100%' : 
                         index === currentIndex ? `${progress}%` : '0%'
                }
              ]} 
            />
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar 
            userId={userId}
            userData={userId === user?.uid ? null : storyUserData}
            user={userId === user?.uid ? user : null}
            size={32}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>
            {getDisplayName()}
          </Text>
          <Text style={styles.storyTime}>
            {currentStory.createdAt ? 
              new Date(currentStory.createdAt.toDate()).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Agora'
            }
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Story content */}
      <View style={styles.storyContent}>
        {currentStory.imageUrl ? (
          <Image 
            source={{ uri: currentStory.imageUrl }}
            style={styles.storyImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noContentContainer}>
            <Ionicons name="image-outline" size={80} color="#666" />
            <Text style={styles.noContentText}>Story sem conteúdo</Text>
          </View>
        )}
      </View>

      {/* Touch areas for navigation */}
      <TouchableOpacity 
        style={styles.leftTouchArea}
        onPress={handlePrevious}
        activeOpacity={1}
      />
      <TouchableOpacity 
        style={styles.rightTouchArea}
        onPress={handleNext}
        activeOpacity={1}
      />

      {/* Story actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paper-plane-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
