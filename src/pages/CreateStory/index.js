import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { socialService } from '../../services/socialService';
import { styles } from './styles';

export default function CreateStory({ navigation }) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Criar Story',
      'Escolha uma opção',
      [
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Galeria', onPress: pickImage },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleCreateStory = async () => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Selecione uma imagem para criar o story');
      return;
    }

    try {
      setLoading(true);
      
      const storyData = {
        userId: user.uid,
        imageUri: selectedImage,
      };
      
      await socialService.createStory(storyData);
      
      Alert.alert('Sucesso', 'Story publicado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao criar story:', error);
      Alert.alert('Erro', 'Não foi possível publicar o story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Story</Text>
        {selectedImage && (
          <TouchableOpacity 
            onPress={handleCreateStory}
            disabled={loading}
            style={styles.publishButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.publishButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {selectedImage ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode='contain' />
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={showImageOptions}
            >
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.changeImageText}>Alterar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="camera" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Criar Story</Text>
            <Text style={styles.emptyText}>
              Compartilhe um momento especial com seus seguidores
            </Text>
            <TouchableOpacity 
              style={styles.selectImageButton}
              onPress={showImageOptions}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.selectImageText}>Selecionar Imagem</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
