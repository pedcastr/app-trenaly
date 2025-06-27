import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export const migrationUtils = {
  async fixPostsStructure() {
    try {
      console.log('Iniciando migração de posts...');
      const postsRef = collection(db, 'posts');
      const snapshot = await getDocs(postsRef);
      
      const updatePromises = [];
      
      snapshot.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const needsUpdate = !Array.isArray(data.likes) || !Array.isArray(data.comments);
        
        if (needsUpdate) {
          console.log(`Corrigindo post ${docSnapshot.id}:`, data);
          updatePromises.push(
            updateDoc(doc(db, 'posts', docSnapshot.id), {
              likes: Array.isArray(data.likes) ? data.likes : [],
              comments: Array.isArray(data.comments) ? data.comments : [],
            })
          );
        }
      });
      
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        console.log(`${updatePromises.length} posts corrigidos`);
      } else {
        console.log('Nenhum post precisou ser corrigido');
      }
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  }
};