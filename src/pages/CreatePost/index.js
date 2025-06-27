import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import { uploadService } from '../../services/uploadService';
import { getAvatarUrl, getUserDisplayName } from '../../utils/avatarUtils';
import { styles } from './styles';

export default function CreatePost({ navigation }) {
  const { user, userData } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    try {
      const result = await uploadService.pickImage();
      if (result) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await uploadService.takePhoto();
      if (result) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Foto',
      'Escolha uma opção',
      [
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Galeria', onPress: pickImage },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handlePublish = async () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert('Erro', 'Adicione um texto ou uma imagem para publicar');
      return;
    }

    try {
      setLoading(true);
      
      await socialService.createPost({
        content: content.trim(),
        imageUri: selectedImage,
        userId: user.uid,
      });
      
      Alert.alert('Sucesso', 'Post publicado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao publicar post:', error);
      Alert.alert('Erro', 'Não foi possível publicar o post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Post</Text>
        <TouchableOpacity 
          onPress={handlePublish}
          disabled={loading || (!content.trim() && !selectedImage)}
          style={[
            styles.publishButton,
            (!content.trim() && !selectedImage) && styles.publishButtonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.publishButtonText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.userSection}>
            <Image 
              source={{ uri: getAvatarUrl(userData, user) }}
              style={styles.userImage}
              resizeMode='contain'
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {getUserDisplayName(userData, user)}
              </Text>
              <View style={styles.privacySelector}>
                <Ionicons name="globe-outline" size={16} color="#666" />
                <Text style={styles.privacyText}>Público</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="O que você está pensando?"
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            
            <View style={styles.characterCountContainer}>
              <Text style={[
                styles.characterCount,
                content.length > 450 && styles.characterCountWarning
              ]}>
                {content.length}/500
              </Text>
            </View>
          </View>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton} onPress={showImageOptions}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="camera" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Foto/Vídeo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="location" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Localização</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#9C27B0', '#7B1FA2']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="happy" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.actionButtonText}>Sentimento</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
