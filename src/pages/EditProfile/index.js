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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../services/firebaseConfig';
import { getAvatarUrl, getUserDisplayName } from '../../utils/avatarUtils';
import { styles } from './styles';

export default function EditProfile({ navigation }) {
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    photoURL: userData?.photoURL || null,
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let photoURL = profileData.photoURL;

      if (selectedImage) {
        // Corrigir o caminho para corresponder às regras do Storage
        const imageRef = ref(storage, `profiles/${user.uid}/profile.jpg`);
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        photoURL = await getDownloadURL(imageRef);
      }

      const updatedData = {
        displayName: profileData.displayName.trim(),
        bio: profileData.bio.trim(),
        photoURL,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'users', user.uid), updatedData);
      await refreshUserData();

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
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
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={styles.saveButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image
              source={{
                uri: selectedImage || getAvatarUrl(userData, user)
              }}
              style={styles.avatar}
            />
            <View style={styles.editAvatarOverlay}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Alterar foto do perfil</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome de exibição</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.displayName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, displayName: text }))}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={profileData.bio}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor="#999"
              multiline
              maxLength={150}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {profileData.bio.length}/150
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            <Text style={styles.infoSubtext}>
              O email não pode ser alterado
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}