import React, { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { useUser } from '../../context/UserContext';
import nutritionService from '../../services/nutritionService';
import dietFirebaseService from '../../services/dietFirebaseService';
import DietCalculator from '../../services/dietCalculator';

// Configurar calendário em português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function Diet() {
  const { user, userData } = useUser();

  // Função para obter data atual de forma segura
  const getTodayDate = () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Erro ao obter data:', error);
      return '2024-01-01'; // Data fallback
    }
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dayFoods, setDayFoods] = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [dailyTargets, setDailyTargets] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  });
  const [dayProgress, setDayProgress] = useState({
    calories: { consumed: 0, target: 2000, remaining: 2000, percentage: 0 },
    protein: { consumed: 0, target: 150, remaining: 150, percentage: 0 },
    carbs: { consumed: 0, target: 250, remaining: 250, percentage: 0 },
    fat: { consumed: 0, target: 67, remaining: 67, percentage: 0 }
  });

  const mealTypes = [
    { id: 'breakfast', name: 'Café da Manhã', icon: 'sunny' },
    { id: 'lunch', name: 'Almoço', icon: 'restaurant' },
    { id: 'snack', name: 'Lanche', icon: 'cafe' },
    { id: 'dinner', name: 'Jantar', icon: 'moon' },
    { id: 'other', name: 'Outro', icon: 'add-circle' }
  ];

  // Calcular metas diárias baseadas no perfil do usuário
  const calculateDailyTargets = useCallback(() => {
    if (!userData) return;

    try {
      const { peso, altura, idade = 25, objetivo, genero = 'masculino', nivelAtividade = 'moderado' } = userData;

      if (!peso || !altura) {
        console.log('Dados do perfil incompletos');
        return;
      }

      const bmr = DietCalculator.calculateBMR(peso, altura, idade, genero);
      const calories = DietCalculator.calculateDailyCalories(bmr, nivelAtividade, objetivo);
      const macros = DietCalculator.calculateMacros(calories, objetivo);

      const newTargets = {
        calories,
        ...macros
      };

      setDailyTargets(newTargets);

      setDayProgress(prev => ({
        calories: { ...prev.calories, target: calories },
        protein: { ...prev.protein, target: macros.protein },
        carbs: { ...prev.carbs, target: macros.carbs },
        fat: { ...prev.fat, target: macros.fat }
      }));

    } catch (error) {
      console.error('Erro ao calcular metas diárias:', error);
    }
  }, [userData]);

  // Carregar dados do dia específico
  const loadDayData = useCallback(async () => {
    if (!user?.uid) {
      console.log('Usuário não autenticado ou UID não disponível');
      return;
    }

    try {
      setLoading(true);

      const foods = await dietFirebaseService.getDayMeals(user.uid, selectedDate);

      setDayFoods(foods);

      // Buscar dados de hidratação
      const progressData = await dietFirebaseService.getProgressHistory(user.uid, selectedDate, selectedDate);
      if (progressData.length > 0) {
        setWaterGlasses(progressData[0].waterGlasses || 0);
      } else {
        setWaterGlasses(0);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dia:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do dia');
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate]);

  // Calcular progresso do dia
  const calculateDayProgress = useCallback(() => {
    if (dayFoods.length === 0) {
      setDayProgress({
        calories: { consumed: 0, target: dailyTargets.calories, remaining: dailyTargets.calories, percentage: 0 },
        protein: { consumed: 0, target: dailyTargets.protein, remaining: dailyTargets.protein, percentage: 0 },
        carbs: { consumed: 0, target: dailyTargets.carbs, remaining: dailyTargets.carbs, percentage: 0 },
        fat: { consumed: 0, target: dailyTargets.fat, remaining: dailyTargets.fat, percentage: 0 }
      });
      return;
    }

    const progress = DietCalculator.calculateDayProgress(dayFoods, dailyTargets);
    setDayProgress(progress);
  }, [dayFoods, dailyTargets]);

  // Buscar alimentos
  const searchFoods = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Atenção', 'Digite o nome do alimento para buscar');
      return;
    }

    setLoading(true);
    try {
      const results = await nutritionService.searchFoods(searchQuery);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert('Nenhum resultado', 'Não foram encontrados alimentos com esse nome');
      }
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
      Alert.alert('Erro', 'Erro ao buscar alimentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar alimento à refeição
  const addFoodToMeal = async (food, quantity = 100) => {
    if (!user?.uid || !selectedMeal) {
      Alert.alert('Erro', 'Usuário não autenticado ou refeição não selecionada');
      return;
    }

    try {
      const foodData = {
        id: `${selectedDate}_${selectedMeal}_${Date.now()}`,
        name: food.name,
        brand: food.brand || '',
        mealType: selectedMeal,
        quantity,
        date: selectedDate,
        nutrients: {
          calories: Math.round((food.nutrients.calories * quantity) / 100),
          protein: Math.round((food.nutrients.protein * quantity) / 100 * 10) / 10,
          carbs: Math.round((food.nutrients.carbs * quantity) / 100 * 10) / 10,
          fat: Math.round((food.nutrients.fat * quantity) / 100 * 10) / 10,
          fiber: Math.round((food.nutrients.fiber * quantity) / 100 * 10) / 10,
          sugar: Math.round((food.nutrients.sugar * quantity) / 100 * 10) / 10,
          sodium: Math.round((food.nutrients.sodium * quantity) / 100),
        },
        timestamp: new Date()
      };

      await dietFirebaseService.addFoodToMeal(user.uid, selectedDate, selectedMeal, foodData);

      // Recarregar dados imediatamente
      await loadDayData();

      // Fechar modal e limpar busca
      setShowAddFood(false);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMeal('');

      Alert.alert('Sucesso', 'Alimento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      Alert.alert('Erro', 'Erro ao adicionar alimento. Tente novamente.');
    }
  };

  // Remover alimento
  const removeFoodFromMeal = async (foodId) => {
    if (!user?.uid) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      await dietFirebaseService.removeFood(user.uid, foodId);
      await loadDayData();
      Alert.alert('Sucesso', 'Alimento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
      Alert.alert('Erro', 'Erro ao remover alimento');
    }
  };

  // Atualizar hidratação
  const updateWaterIntake = async (glasses) => {
    setWaterGlasses(glasses);

    if (user?.uid) {
      try {
        await dietFirebaseService.saveDayProgress(user.uid, selectedDate, {
          waterGlasses: glasses,
          ...dayProgress
        });
      } catch (error) {
        console.error('Erro ao salvar progresso da água:', error);
      }
    }
  };

  // Função para atualizar (pull to refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDayData();
    setRefreshing(false);
  }, [loadDayData]);

  // Obter alimentos de uma refeição específica
  const getMealFoods = (mealType) => {
    return dayFoods.filter(food =>
      food.mealType === mealType &&
      food.date === selectedDate
    );
  };

  // Calcular calorias de uma refeição
  const getMealCalories = (mealType) => {
    const foods = getMealFoods(mealType);
    return foods.reduce((total, food) => total + (food.nutrients?.calories || 0), 0);
  };

  // Formatar data para exibição de forma segura
  const formatDate = (dateString) => {
    try {
      // Verificar se a data é válida
      if (!dateString || typeof dateString !== 'string') {
        return 'Data inválida';
      }

      // Criar data de forma segura
      const [year, month, day] = dateString.split('-');
      if (!year || !month || !day) {
        return 'Data inválida';
      }

      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Obter status do dia
  const getDayStatus = () => {
    try {
      return DietCalculator.getDayStatus(dayProgress);
    } catch (error) {
      console.error('Erro ao obter status do dia:', error);
      return {
        status: 'erro',
        color: '#666',
        icon: 'help-circle',
        message: 'Erro'
      };
    }
  };

  // Effects
  useEffect(() => {
    if (userData && user) {
      calculateDailyTargets();
    }
  }, [userData, user, calculateDailyTargets]);

  useEffect(() => {
    if (selectedDate && user?.uid) {
      loadDayData();
    }
  }, [selectedDate, loadDayData]);

  useEffect(() => {
    calculateDayProgress();
  }, [dayFoods, dailyTargets, calculateDayProgress]);

  // Recarregar quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        loadDayData();
      }
    }, [loadDayData, user])
  );

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666' }}>
          Carregando dados do usuário...
        </Text>
      </View>
    );
  }

  if (!user.uid) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
          Erro: Usuário não autenticado corretamente.{'\n'}
          Tente fazer login novamente.
        </Text>
      </View>
    );
  }

  const dayStatus = getDayStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Minha Dieta</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons name="calendar" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          <View style={[styles.statusIndicator, { backgroundColor: dayStatus.color }]}>
            <Ionicons name={dayStatus.icon} size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#276999']}
            tintColor="#276999"
          />
        }
      >
        {/* Resumo Calórico */}
        <View style={styles.calorieCard}>
          <Text style={styles.cardTitle}>Resumo do Dia</Text>
          <View style={styles.calorieInfo}>
            <View style={styles.calorieItem}>
              <Text style={styles.calorieNumber}>{dayProgress.calories.target}</Text>
              <Text style={styles.calorieLabel}>Meta</Text>
            </View>
            <View style={styles.calorieItem}>
              <Text style={[styles.calorieNumber, { color: '#276999' }]}>
                {dayProgress.calories.consumed}
              </Text>
              <Text style={styles.calorieLabel}>Consumidas</Text>
            </View>
            <View style={styles.calorieItem}>
              <Text style={[styles.calorieNumber, {
                color: dayProgress.calories.remaining > 0 ? '#28a745' : '#dc3545'
              }]}>
                {dayProgress.calories.remaining}
              </Text>
              <Text style={styles.calorieLabel}>Restantes</Text>
            </View>
          </View>

          {/* Barra de Progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                {
                  width: `${Math.min(dayProgress.calories.percentage, 100)}%`,
                  backgroundColor: dayStatus.color
                }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {dayProgress.calories.percentage}% da meta - {dayStatus.message}
            </Text>
          </View>
        </View>

        {/* Hidratação */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Ionicons name="water" size={24} color="#276999" style={{ marginRight: 10, marginTop: -13 }} />
            <Text style={styles.cardTitle}>Hidratação</Text>
          </View>
          <View style={styles.waterGlasses}>
            {[...Array(8)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => updateWaterIntake(index + 1)}
                style={styles.glassContainer}
              >
                <Ionicons
                  name={index < waterGlasses ? "water" : "water-outline"}
                  size={30}
                  color={index < waterGlasses ? "#276999" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.waterText}>{waterGlasses}/8 copos (2L)</Text>
        </View>

        {/* Refeições */}
        <View style={styles.mealsContainer}>
          {mealTypes.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealInfo}>
                  <View style={styles.mealTitleRow}>
                    <Ionicons name={meal.icon} size={20} color="#276999" />
                    <Text style={styles.mealTitle}>{meal.name}</Text>
                  </View>
                  <Text style={styles.mealCalories}>
                    {getMealCalories(meal.id)} kcal
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setSelectedMeal(meal.id);
                    setShowAddFood(true);
                  }}
                >
                  <Ionicons name="add-circle" size={28} color="#276999" />
                </TouchableOpacity>
              </View>

              {/* Alimentos da refeição */}
              {getMealFoods(meal.id).length > 0 && (
                <View style={styles.foodList}>
                  {getMealFoods(meal.id).map((food, index) => (
                    <View key={`${food.id}_${index}`} style={styles.foodItem}>
                      <View style={styles.foodInfo}>
                        <Text style={styles.foodName}>{food.name}</Text>
                        {food.brand && (
                          <Text style={styles.foodBrand}>{food.brand}</Text>
                        )}
                        <Text style={styles.foodDetails}>
                          {food.quantity}g • {food.nutrients?.calories || 0} kcal
                        </Text>
                        <Text style={styles.foodTime}>
                          {food.timestamp && food.timestamp.seconds ?
                            new Date(food.timestamp.seconds * 1000).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) :
                            new Date().toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          }
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFoodFromMeal(food.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#dc3545" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Macronutrientes */}
        <View style={styles.macroCard}>
          <Text style={styles.cardTitle}>Macronutrientes</Text>
          <View style={styles.macroContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: '#ff6b6b' }]}>
                <Text style={styles.macroPercentage}>{dayProgress.carbs.percentage}%</Text>
              </View>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <Text style={styles.macroValue}>
                {dayProgress.carbs.consumed}g / {dayProgress.carbs.target}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: '#4ecdc4' }]}>
                <Text style={styles.macroPercentage}>{dayProgress.protein.percentage}%</Text>
              </View>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <Text style={styles.macroValue}>
                {dayProgress.protein.consumed}g / {dayProgress.protein.target}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: '#45b7d1' }]}>
                <Text style={styles.macroPercentage}>{dayProgress.fat.percentage}%</Text>
              </View>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <Text style={styles.macroValue}>
                {dayProgress.fat.consumed}g / {dayProgress.fat.target}g
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal do Calendário */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Data</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#276999'
                },
                [getTodayDate()]: {
                  marked: true,
                  dotColor: '#28a745'
                }
              }}
              theme={{
                selectedDayBackgroundColor: '#276999',
                todayTextColor: '#276999',
                arrowColor: '#276999',
                monthTextColor: '#333',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
              firstDay={0}
              hideExtraDays={true}
              disableMonthChange={false}
              hideDayNames={false}
              showWeekNumbers={false}
              disableArrowLeft={false}
              disableArrowRight={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Adicionar Alimento */}
      <Modal
        visible={showAddFood}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddFood(false);
          setSearchQuery('');
          setSearchResults([]);
          setSelectedMeal('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addFoodModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Adicionar Alimento - {mealTypes.find(m => m.id === selectedMeal)?.name}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowAddFood(false);
                setSearchQuery('');
                setSearchResults([]);
                setSelectedMeal('');
              }}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Ex.: arroz, frango, banana..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={searchFoods}
                keyboardType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchFoods}
                disabled={loading}
              >
                <Ionicons
                  name={loading ? "hourglass" : "search"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.searchResults}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Buscando alimentos...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                searchResults.map((food, index) => (
                  <TouchableOpacity
                    key={`${food.id}_${index}`}
                    style={styles.foodResultItem}
                    onPress={() => addFoodToMeal(food)}
                  >
                    <View style={styles.foodResultInfo}>
                      <Text style={styles.foodResultName}>{food.name}</Text>
                      {food.brand && (
                        <Text style={styles.foodResultBrand}>{food.brand}</Text>
                      )}
                      <Text style={styles.foodResultCategory}>{food.category}</Text>
                      <Text style={styles.foodResultCalories}>
                        {food.nutrients.calories} kcal por 100g
                      </Text>
                      <Text style={styles.foodResultMacros}>
                        P: {food.nutrients.protein}g | C: {food.nutrients.carbs}g | G: {food.nutrients.fat}g
                      </Text>
                    </View>
                    <Ionicons name="add" size={24} color="#276999" />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.searchHintContainer}>
                  <Text style={styles.searchHintText}>
                    Digite o nome do alimento que deseja adicionar.
                  </Text>
                  <Text style={styles.searchHintSubtext}>
                    Exemplos: arroz, peito de frango, banana, feijão preto...
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

