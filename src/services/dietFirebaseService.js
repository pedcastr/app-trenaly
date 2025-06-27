import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    updateDoc,
    onSnapshot
} from 'firebase/firestore';
import { db } from './firebaseConfig'; 

class DietFirebaseService {
    // Salvar refeição do usuário com data específica
    async saveMeal(userId, date, mealData) {
        try {
            console.log('Salvando refeição para userId:', userId, 'data:', date);
            const mealRef = doc(db, 'diet', userId, 'meals', `${date}_${mealData.mealType}_${Date.now()}`);
            await setDoc(mealRef, {
                ...mealData,
                date,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error('Erro ao salvar refeição:', error);
            throw error;
        }
    }

    // Buscar refeições de um dia específico
    async getDayMeals(userId, date) {
        try {
            console.log('Buscando refeições para userId:', userId, 'data:', date);
            
            if (!userId) {
                console.error('UserId não fornecido');
                return [];
            }

            const mealsRef = collection(db, 'diet', userId, 'meals');
            const q = query(
                mealsRef,
                where('date', '==', date),
                orderBy('createdAt', 'asc')
            );

            const querySnapshot = await getDocs(q);
            const meals = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                meals.push({
                    id: doc.id,
                    ...data,
                    date: data.date || date
                });
            });

            console.log(`Refeições encontradas para ${date}:`, meals.length);
            return meals;
        } catch (error) {
            console.error('Erro ao buscar refeições:', error);
            console.error('Detalhes do erro:', error.code, error.message);
            return [];
        }
    }

    // Adicionar alimento a uma refeição com data específica
    async addFoodToMeal(userId, date, mealId, foodData) {
        try {
            console.log('Adicionando alimento para userId:', userId, 'data:', date);
            
            if (!userId) {
                throw new Error('UserId não fornecido');
            }

            const foodRef = doc(db, 'diet', userId, 'meals', foodData.id);
            await setDoc(foodRef, {
                ...foodData,
                mealType: mealId,
                date,
                timestamp: new Date(),
                createdAt: new Date()
            });
            
            console.log('Alimento adicionado:', foodData.name, 'para', date);
            return true;
        } catch (error) {
            console.error('Erro ao adicionar alimento:', error);
            throw error;
        }
    }

    // Remover alimento
    async removeFood(userId, foodId) {
        try {
            console.log('Removendo alimento para userId:', userId, 'foodId:', foodId);
            
            if (!userId) {
                throw new Error('UserId não fornecido');
            }

            const foodRef = doc(db, 'diet', userId, 'meals', foodId);
            await deleteDoc(foodRef);
            console.log('Alimento removido:', foodId);
            return true;
        } catch (error) {
            console.error('Erro ao remover alimento:', error);
            throw error;
        }
    }

    // Salvar progresso diário
    async saveDayProgress(userId, date, progressData) {
        try {
            console.log('Salvando progresso para userId:', userId, 'data:', date);
            
            if (!userId) {
                throw new Error('UserId não fornecido');
            }

            const progressRef = doc(db, 'diet', userId, 'progress', date);
            await setDoc(progressRef, {
                ...progressData,
                date,
                updatedAt: new Date()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
            throw error;
        }
    }

    // Buscar progresso de um período
    async getProgressHistory(userId, startDate, endDate) {
        try {
            console.log('Buscando histórico para userId:', userId);
            
            if (!userId) {
                return [];
            }

            const progressRef = collection(db, 'diet', userId, 'progress');
            const q = query(
                progressRef,
                where('date', '>=', startDate),
                where('date', '<=', endDate),
                orderBy('date', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const progress = [];

            querySnapshot.forEach((doc) => {
                progress.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return progress;
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            return [];
        }
    }

    // Listener em tempo real para refeições do dia
    listenToDayMeals(userId, date, callback) {
        try {
            if (!userId) {
                console.error('UserId não fornecido para listener');
                return null;
            }

            console.log('Configurando listener para userId:', userId, 'data:', date);
            
            const mealsRef = collection(db, 'diet', userId, 'meals');
            const q = query(
                mealsRef,
                where('date', '==', date),
                orderBy('createdAt', 'asc')
            );

            return onSnapshot(q, (querySnapshot) => {
                const meals = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    meals.push({
                        id: doc.id,
                        ...data,
                        date: data.date || date
                    });
                });
                console.log('Listener - refeições atualizadas:', meals.length);
                callback(meals);
            }, (error) => {
                console.error('Erro no listener:', error);
            });
        } catch (error) {
            console.error('Erro ao configurar listener:', error);
            return null;
        }
    }

    // Salvar configurações de dieta do usuário
    async saveDietSettings(userId, settings) {
        try {
            if (!userId) {
                throw new Error('UserId não fornecido');
            }

            const settingsRef = doc(db, 'diet', userId, 'settings', 'config');
            await setDoc(settingsRef, {
                ...settings,
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            throw error;
        }
    }

    // Buscar configurações de dieta
    async getDietSettings(userId) {
        try {
            if (!userId) {
                return null;
            }

            const settingsRef = doc(db, 'diet', userId, 'settings', 'config');
            const docSnap = await getDoc(settingsRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar configurações:', error);
            return null;
        }
    }
}

export default new DietFirebaseService();
