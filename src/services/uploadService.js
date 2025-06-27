import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

export const uploadService = {
  async uploadImage(uri, folder = 'posts') {
    try {
      console.log('=== INÍCIO DO UPLOAD ===');
      console.log('URI:', uri);
      console.log('Folder:', folder);
      
      const response = await fetch(uri);
      console.log('Response status:', response.status);
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      
      const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      console.log('Filename:', filename);
      
      const storageRef = ref(storage, filename);
      console.log('Storage ref criada');
      
      console.log('Iniciando upload...');
      const uploadResult = await uploadBytes(storageRef, blob);
      console.log('Upload concluído:', uploadResult.metadata.name);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL obtida:', downloadURL);
      
      console.log('=== UPLOAD CONCLUÍDO COM SUCESSO ===');
      return downloadURL;
    } catch (error) {
      console.error('=== ERRO NO UPLOAD ===');
      console.error('Erro completo:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem do erro:', error.message);
      throw error;
    }
  },

  async pickImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permissão para acessar galeria negada');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Imagem selecionada:', result.assets[0].uri);
        return result.assets[0];
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      throw error;
    }
  },

  async takePhoto() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permissão para usar câmera negada');
      }

      const result = await ImagePicker.launchCameraAsync({
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Foto tirada:', result.assets[0].uri);
        return result.assets[0];
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      throw error;
    }
  },
};
