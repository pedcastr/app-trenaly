import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { uploadService } from './uploadService';

// Função auxiliar para garantir que um valor seja um array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [];
};

export const socialService = {
  // Posts
  async createPost(postData) {
    try {
      let imageUrl = null;

      // Se tem imagem, fazer upload
      if (postData.imageUri) {
        imageUrl = await uploadService.uploadImage(postData.imageUri, 'posts');
      }

      const docRef = await addDoc(collection(db, 'posts'), {
        userId: postData.userId,
        content: postData.content || '',
        imageUrl: imageUrl,
        likes: [],
        comments: [],
        createdAt: new Date(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  },

  async getFeedPosts() {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          likes: ensureArray(data.likes),
          comments: ensureArray(data.comments),
        };
      });
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  },

  async getUserPosts(userId) {
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          likes: ensureArray(data.likes),
          comments: ensureArray(data.comments),
        };
      });
    } catch (error) {
      console.error('Erro ao buscar posts do usuário:', error);
      return [];
    }
  },

  async toggleLike(postId, userId) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();
        const likes = ensureArray(postData.likes);
        const isLiked = likes.includes(userId);

        if (isLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(userId)
          });
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(userId)
          });
        }
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir post:', error);
      throw error;
    }
  },

  // Stories
  async createStory(storyData) {
    try {
      let imageUrl = null;

      // Se tem imagem, fazer upload
      if (storyData.imageUri) {
        imageUrl = await uploadService.uploadImage(storyData.imageUri, 'stories');
      }

      const docRef = await addDoc(collection(db, 'stories'), {
        userId: storyData.userId,
        imageUrl: imageUrl,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar story:', error);
      throw error;
    }
  },

  async getStories() {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'stories'),
        where('expiresAt', '>', now),
        orderBy('expiresAt'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      // Agrupar stories por usuário
      const storiesByUser = {};
      querySnapshot.docs.forEach(doc => {
        const story = { id: doc.id, ...doc.data() };
        const userId = story.userId;

        if (!storiesByUser[userId]) {
          storiesByUser[userId] = [];
        }
        storiesByUser[userId].push(story);
      });

      return storiesByUser;
    } catch (error) {
      console.error('Erro ao buscar stories:', error);
      return {};
    }
  },

  async getUserStories(userId) {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'stories'),
        where('userId', '==', userId),
        where('expiresAt', '>', now),
        orderBy('expiresAt'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar stories do usuário:', error);
      return [];
    }
  },

  // Comments
  async addComment(postId, commentData) {
    try {
      console.log('Adicionando comentário:', { postId, commentData });

      const docRef = await addDoc(collection(db, 'comments'), {
        postId,
        userId: commentData.userId,
        content: commentData.content,
        createdAt: new Date(),
      });

      console.log('Comentário adicionado com ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      console.error('Detalhes do erro:', {
        code: error.code,
        message: error.message,
        postId,
        commentData
      });
      throw error;
    }
  },

  async getComments(postId) {
    try {
      console.log('Buscando comentários para o post:', postId);

      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const comments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Comentários encontrados:', comments.length);
      return comments;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  },

  // MÉTODO ALTERNATIVO PARA COMPATIBILIDADE
  async getPostComments(postId) {
    return this.getComments(postId);
  },

  // User data
  async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  },

  async updateUserData(userId, userData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  },

  // Chat methods
  async createChat(participants) {
    try {
      const docRef = await addDoc(collection(db, 'chats'), {
        participants,
        createdAt: new Date(),
        lastMessage: null,
        lastMessageTime: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      throw error;
    }
  },

  async getUserChats(userId) {
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      return [];
    }
  },

  async sendMessage(chatId, messageData) {
    try {
      // Adicionar mensagem
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        chatId,
        createdAt: new Date(),
      });

      // Atualizar último message do chat
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageData.text,
        lastMessageTime: new Date(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  },

  async getChatMessages(chatId) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  },
};

