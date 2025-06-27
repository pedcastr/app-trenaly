import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const userService = {
  async initializeUser(user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Criar documento inicial do usuário
        const userData = {
          displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
          email: user.email,
          photoURL: user.photoURL || null,
          bio: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(userRef, userData);
        return userData;
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Erro ao inicializar usuário:', error);
      throw error;
    }
  },
};