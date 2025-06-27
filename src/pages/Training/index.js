import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, Modal, Platform, ActivityIndicator, Alert, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import YouTubeService from '../../services/youtubeService';
import ExerciseDatabase from '../../services/exerciseDatabase';

export default function Training() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWorkout, setCurrentWorkout] = useState({ title: '', exercises: [] });
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);

  // Novos estados para as melhorias
  const [workoutType, setWorkoutType] = useState('gym'); // gym, home, outdoor
  const [workoutTypeModalVisible, setWorkoutTypeModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [forceLevel, setForceLevel] = useState(null);

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingExerciseData, setEditingExerciseData] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    rest: '',
    muscle: ''
  });

  // Estados para funcionalidades dos botões
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Configurar calendário com datas reais
  useEffect(() => {
    setupCalendar();
    loadCompletedExercises();
    loadWorkoutType();
  }, []);

  // Carregar treino quando o dia ou tipo muda
  useEffect(() => {
    loadWorkoutForDay(selectedDay);
  }, [selectedDay, workoutType, forceLevel]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => {
          if (seconds <= 1) {
            setTimerActive(false);
            setTimerModalVisible(false);
            Alert.alert('⏰ Tempo!', 'Hora de fazer a próxima série!');
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    } else if (!timerActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const loadWorkoutType = async () => {
    try {
      const savedType = await AsyncStorage.getItem('workout_type');
      if (savedType) {
        setWorkoutType(savedType);
      }
    } catch (error) {
      console.error('Erro ao carregar tipo de treino:', error);
    }
  };

  const saveWorkoutType = async (type) => {
    try {
      await AsyncStorage.setItem('workout_type', type);
      setWorkoutType(type);
    } catch (error) {
      console.error('Erro ao salvar tipo de treino:', error);
    }
  };

  const setupCalendar = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const adjustedCurrentDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      const dayDiff = i - adjustedCurrentDay;
      date.setDate(today.getDate() + dayDiff);

      days.push({
        name: weekDays[i],
        number: date.getDate(),
        isToday: i === adjustedCurrentDay,
        fullDate: date
      });
    }

    setCalendarDays(days);
    setSelectedDay(adjustedCurrentDay);
  };

  const loadWorkoutForDay = (dayIndex) => {
    const workout = ExerciseDatabase.getWorkoutForDay(dayIndex, workoutType, forceLevel);
    setCurrentWorkout(workout);
  };

  const loadCompletedExercises = async () => {
    try {
      const today = new Date().toDateString();
      const completed = await AsyncStorage.getItem(`completed_exercises_${today}`);
      if (completed) {
        setCompletedExercises(new Set(JSON.parse(completed)));
      }
    } catch (error) {
      console.error('Erro ao carregar exercícios concluídos:', error);
    }
  };

  const saveCompletedExercises = async (completed) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`completed_exercises_${today}`, JSON.stringify([...completed]));
    } catch (error) {
      console.error('Erro ao salvar exercícios concluídos:', error);
    }
  };

  // Função para obter status do dia (para os ícones coloridos)
  const getDayStatus = (dayIndex) => {
    const dayWorkout = ExerciseDatabase.getWorkoutForDay(dayIndex, workoutType, forceLevel);
    const completedCount = [...completedExercises].filter(id => id.startsWith(`${dayIndex}_`)).length;
    const totalExercises = dayWorkout.exercises.length;

    if (totalExercises === 0) return 'rest'; // Dia de descanso
    if (completedCount === 0) return 'missed'; // Não fez nenhum
    if (completedCount === totalExercises) return 'completed'; // Completou todos
    return 'partial'; // Fez alguns
  };

  // Função para obter ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'checkmark-circle', color: '#28a745' };
      case 'partial':
        return { name: 'time', color: '#ffc107' };
      case 'missed':
        return { name: 'close-circle', color: '#dc3545' };
      case 'rest':
        return { name: 'bed', color: '#6c757d' };
      default:
        return { name: 'ellipse-outline', color: '#dee2e6' };
    }
  };

  // Função para marcar exercício como concluído
  const handleCompleteExercise = (exerciseIndex) => {
    const exerciseId = `${selectedDay}_${exerciseIndex}`;
    const newCompleted = new Set(completedExercises);

    if (completedExercises.has(exerciseId)) {
      newCompleted.delete(exerciseId);
      Alert.alert('✅ Exercício desmarcado', 'Exercício removido da lista de concluídos');
    } else {
      newCompleted.add(exerciseId);
      Alert.alert('🎉 Parabéns!', 'Exercício concluído com sucesso!');
    }

    setCompletedExercises(newCompleted);
    saveCompletedExercises(newCompleted);
  };

  // Função para iniciar timer de descanso
  const handleStartTimer = (restTime) => {
    let seconds = 60;

    if (restTime.includes('min')) {
      seconds = parseInt(restTime) * 60;
    } else if (restTime.includes('s')) {
      seconds = parseInt(restTime);
    }

    setTimerSeconds(seconds);
    setTimerActive(true);
    setTimerModalVisible(true);
  };

  const handleStopTimer = () => {
    setTimerActive(false);
    setTimerModalVisible(false);
    setTimerSeconds(0);
  };

  const handleAddTime = (additionalSeconds) => {
    setTimerSeconds(prev => prev + additionalSeconds);
  };

  // Função para editar exercício
  const handleEditExercise = (exerciseIndex) => {
    const exercise = currentWorkout.exercises[exerciseIndex];
    setEditingExerciseData({
      index: exerciseIndex,
      ...exercise
    });
    setEditModalVisible(true);
  };

  // Função para salvar exercício editado
  const saveEditedExercise = async () => {
    if (!editingExerciseData.name.trim()) {
      Alert.alert('Erro', 'Nome do exercício é obrigatório');
      return;
    }

    try {
      await ExerciseDatabase.updateCustomExercise(
        selectedDay,
        editingExerciseData.index,
        {
          name: editingExerciseData.name,
          sets: editingExerciseData.sets,
          rest: editingExerciseData.rest,
          muscle: editingExerciseData.muscle
        },
        workoutType,
        forceLevel
      );

      // Recarregar treino
      loadWorkoutForDay(selectedDay);
      setEditModalVisible(false);
      setEditingExerciseData(null);
      Alert.alert('Sucesso!', 'Exercício atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
      Alert.alert('Erro', 'Não foi possível salvar o exercício');
    }
  };

  // Função para adicionar novo exercício
  const handleAddExercise = () => {
    setNewExercise({
      name: '',
      sets: '',
      rest: '',
      muscle: ''
    });
    setAddModalVisible(true);
  };

  // Função para salvar novo exercício
  const saveNewExercise = async () => {
    if (!newExercise.name.trim()) {
      Alert.alert('Erro', 'Nome do exercício é obrigatório');
      return;
    }

    try {
      await ExerciseDatabase.addNewExercise(
        selectedDay,
        newExercise,
        workoutType,
        forceLevel
      );

      // Recarregar treino
      loadWorkoutForDay(selectedDay);
      setAddModalVisible(false);
      setNewExercise({
        name: '',
        sets: '',
        rest: '',
        muscle: ''
      });
      Alert.alert('Sucesso!', 'Exercício adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o exercício');
    }
  };

  // Função para excluir exercício
  const handleDeleteExercise = (exerciseIndex) => {
    Alert.alert(
      'Excluir Exercício',
      'Tem certeza que deseja excluir este exercício? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ExerciseDatabase.removeCustomExercise(
                selectedDay,
                exerciseIndex,
                workoutType,
                forceLevel
              );

              // Recarregar treino
              loadWorkoutForDay(selectedDay);
              Alert.alert('Sucesso!', 'Exercício excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir exercício:', error);
              Alert.alert('Erro', 'Não foi possível excluir o exercício');
            }
          }
        }
      ]
    );
  };

  const handleVideoPress = async (exerciseName) => {
    setLoadingVideo(true);
    setVideoModalVisible(true);

    try {
      const videos = await YouTubeService.searchExerciseVideos(exerciseName, 1);
      if (videos && videos.length > 0) {
        const video = videos[0];
        if (!video.url && video.id) {
          video.url = `https://www.youtube.com/watch?v=${video.id}`;
        }
        setSelectedVideo(video);
      } else {
        setSelectedVideo({
          id: 'dQw4w9WgXcQ',
          title: 'Vídeo não encontrado',
          description: 'Não foi possível encontrar um vídeo para este exercício.',
          channelTitle: 'Trenaly',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar vídeo:', error);
      setSelectedVideo({
        id: 'dQw4w9WgXcQ',
        title: 'Erro ao carregar vídeo',
        description: 'Verifique sua conexão com a internet e tente novamente.',
        channelTitle: 'Trenaly',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      });
    } finally {
      setLoadingVideo(false);
    }
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCalendar = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webCalendarContainer}>
          <View style={styles.webCalendarGrid}>
            {calendarDays.map((day, index) => {
              const status = getDayStatus(index);
              const statusIcon = getStatusIcon(status);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.webDayButton,
                    selectedDay === index && styles.selectedWebDayButton,
                    day.isToday && styles.todayWebDayButton
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <View style={styles.dayStatusContainer}>
                    <Ionicons
                      name={statusIcon.name}
                      size={12}
                      color={statusIcon.color}
                      style={styles.dayStatusIcon}
                    />
                  </View>
                  <Text style={[
                    styles.webDayText,
                    selectedDay === index && styles.selectedWebDayText,
                    day.isToday && styles.todayWebDayText
                  ]}>
                    {day.name}
                  </Text>
                  <Text style={[
                    styles.webDayNumber,
                    selectedDay === index && styles.selectedWebDayNumber,
                    day.isToday && styles.todayWebDayNumber
                  ]}>
                    {day.number}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.daySelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysContainer}>
            {calendarDays.map((day, index) => {
              const status = getDayStatus(index);
              const statusIcon = getStatusIcon(status);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    selectedDay === index && styles.selectedDayButton,
                    day.isToday && styles.todayDayButton
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <View style={styles.dayStatusContainer}>
                    <Ionicons
                      name={statusIcon.name}
                      size={14}
                      color={statusIcon.color}
                      style={styles.dayStatusIcon}
                    />
                  </View>
                  <Text style={[
                    styles.dayText,
                    selectedDay === index && styles.selectedDayText,
                    day.isToday && styles.todayDayText
                  ]}>
                    {day.name}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    selectedDay === index && styles.selectedDayNumber,
                    day.isToday && styles.todayDayNumber
                  ]}>
                    {day.number}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }
  };

  const getWorkoutTypeInfo = () => {
    const types = {
      gym: { icon: 'barbell', label: 'Academia', color: '#276999' },
      home: { icon: 'home', label: 'Casa', color: '#28a745' },
      outdoor: { icon: 'leaf', label: 'Ar Livre', color: '#17a2b8' }
    };
    return types[workoutType] || types.gym;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Meus Treinos</Text>
            <Text style={styles.headerSubtitle}>
              {ExerciseDatabase.getLevelInfo(forceLevel).title}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setWorkoutTypeModalVisible(true)}
            >
              <Ionicons name={getWorkoutTypeInfo().icon} size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setLevelModalVisible(true)}
            >
              <Ionicons name="trending-up-outline" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setCalendarModalVisible(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Tipo de Treino Indicator */}
      <View style={styles.workoutTypeIndicator}>
        <View style={[styles.typeIndicator, { backgroundColor: getWorkoutTypeInfo().color }]}>
          <Ionicons name={getWorkoutTypeInfo().icon} size={16} color="#fff" />
          <Text style={styles.typeIndicatorText}>{getWorkoutTypeInfo().label}</Text>
        </View>
      </View>

      {/* Calendário */}
      {renderCalendar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título do Treino */}
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>{currentWorkout.title}</Text>
          {currentWorkout.exercises.length > 0 && (
            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="barbell-outline" size={20} color="#276999" />
                <Text style={styles.statText}>{currentWorkout.exercises.length} exercícios</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#276999" />
                <Text style={styles.statText}>~60 min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#28a745" />
                <Text style={styles.statText}>
                  {[...completedExercises].filter(id => id.startsWith(`${selectedDay}_`)).length}/{currentWorkout.exercises.length}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Lista de Exercícios */}
        {currentWorkout.exercises.length > 0 ? (
          <View style={styles.exercisesList}>
            {currentWorkout.exercises.map((exercise, index) => {
              const exerciseId = `${selectedDay}_${index}`;
              const isCompleted = completedExercises.has(exerciseId);
              const isCustom = exercise.isNew || exercise.isEdited;

              return (
                <View key={index} style={[styles.exerciseCard, isCompleted && styles.completedCard]}>
                  <View style={styles.exerciseHeader}>
                    <View style={[styles.exerciseNumber, isCompleted && styles.completedNumber]}>
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      ) : (
                        <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                      )}
                    </View>
                    <View style={styles.exerciseInfo}>
                      <View style={styles.exerciseNameContainer}>
                        <Text style={[styles.exerciseName, isCompleted && styles.completedText]}>
                          {exercise.name}
                        </Text>
                        {isCustom && (
                          <View style={styles.customBadge}>
                            <Text style={styles.customBadgeText}>Personalizado</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.exerciseSets}>{exercise.sets}</Text>
                        <Text style={styles.exerciseRest}>Descanso: {exercise.rest}</Text>
                        <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.videoButton}
                      onPress={() => handleVideoPress(exercise.name)}
                    >
                      <Ionicons name="play-circle" size={32} color="#276999" />
                    </TouchableOpacity>
                  </View>

                  {/* Botões de Ação */}
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, isCompleted && styles.completedActionButton]}
                      onPress={() => handleCompleteExercise(index)}
                    >
                      <Ionicons
                        name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
                        size={20}
                        color={isCompleted ? "#fff" : "#28a745"}
                      />
                      <Text style={[styles.actionText, { color: isCompleted ? "#fff" : "#28a745" }]}>
                        {isCompleted ? 'Concluído' : 'Concluir'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditExercise(index)}
                    >
                      <Ionicons name="create-outline" size={20} color="#276999" />
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleStartTimer(exercise.rest)}
                    >
                      <Ionicons name="timer-outline" size={20} color="#ff6b6b" />
                      <Text style={[styles.actionText, { color: '#ff6b6b' }]}>Timer</Text>
                    </TouchableOpacity>

                    {/* Botão Excluir - só aparece para exercícios customizados */}
                    {isCustom && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteExercise(index)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#dc3545" />
                        <Text style={[styles.actionText, { color: '#dc3545' }]}>Excluir</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.restDay}>
            <Ionicons name="bed-outline" size={64} color="#ccc" />
            <Text style={styles.restDayTitle}>Dia de Descanso</Text>
            <Text style={styles.restDayText}>
              Aproveite para relaxar e permitir que seus músculos se recuperem!
            </Text>
          </View>
        )}

        {/* Botão Adicionar Exercício */}
        {currentWorkout.exercises.length > 0 && (
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={handleAddExercise}
          >
            <LinearGradient
              colors={['#276999', '#1e5a7a']}
              style={styles.addExerciseGradient}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.addExerciseText}>Adicionar Exercício</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal Tipo de Treino */}
      <Modal
        visible={workoutTypeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setWorkoutTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.workoutTypeModal}>
            <Text style={styles.modalTitle}>Escolher Local de Treino</Text>

            <TouchableOpacity
              style={[
                styles.workoutTypeOption,
                workoutType === 'gym' && styles.selectedWorkoutTypeOption
              ]}
              onPress={() => {
                saveWorkoutType('gym');
                setWorkoutTypeModalVisible(false);
              }}
            >
              <Ionicons name="barbell" size={24} color="#276999" />
              <View style={styles.workoutTypeOptionText}>
                <Text style={styles.workoutTypeOptionTitle}>Academia</Text>
                <Text style={styles.workoutTypeOptionDescription}>Equipamentos completos e pesos livres</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.workoutTypeOption,
                workoutType === 'home' && styles.selectedWorkoutTypeOption
              ]}
              onPress={() => {
                saveWorkoutType('home');
                setWorkoutTypeModalVisible(false);
              }}
            >
              <Ionicons name="home" size={24} color="#28a745" />
              <View style={styles.workoutTypeOptionText}>
                <Text style={styles.workoutTypeOptionTitle}>Casa</Text>
                <Text style={styles.workoutTypeOptionDescription}>Exercícios com peso corporal e equipamentos básicos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.workoutTypeOption,
                workoutType === 'outdoor' && styles.selectedWorkoutTypeOption
              ]}
              onPress={() => {
                saveWorkoutType('outdoor');
                setWorkoutTypeModalVisible(false);
              }}
            >
              <Ionicons name="leaf" size={24} color="#17a2b8" />
              <View style={styles.workoutTypeOptionText}>
                <Text style={styles.workoutTypeOptionTitle}>Ar Livre</Text>
                <Text style={styles.workoutTypeOptionDescription}>Parques, praças e calistenia</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setWorkoutTypeModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Nível de Treino */}
      <Modal
        visible={levelModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLevelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.levelModal}>
            <Text style={styles.modalTitle}>Escolher Nível de Treino</Text>

            <TouchableOpacity
              style={[
                styles.levelOption,
                (forceLevel || ExerciseDatabase.getCurrentLevel()) === 'beginner' && styles.selectedLevelOption
              ]}
              onPress={() => {
                setForceLevel('beginner');
                setLevelModalVisible(false);
              }}
            >
              <Ionicons name="school-outline" size={24} color="#28a745" />
              <View style={styles.levelOptionText}>
                <Text style={styles.levelOptionTitle}>Iniciante</Text>
                <Text style={styles.levelOptionDescription}>Foco em aprender os movimentos básicos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelOption,
                (forceLevel || ExerciseDatabase.getCurrentLevel()) === 'intermediate' && styles.selectedLevelOption
              ]}
              onPress={() => {
                setForceLevel('intermediate');
                setLevelModalVisible(false);
              }}
            >
              <Ionicons name="barbell-outline" size={24} color="#ffc107" />
              <View style={styles.levelOptionText}>
                <Text style={styles.levelOptionTitle}>Intermediário</Text>
                <Text style={styles.levelOptionDescription}>Intensificando o treino com mais volume</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelOption,
                (forceLevel || ExerciseDatabase.getCurrentLevel()) === 'advanced' && styles.selectedLevelOption
              ]}
              onPress={() => {
                setForceLevel('advanced');
                setLevelModalVisible(false);
              }}
            >
              <Ionicons name="trophy-outline" size={24} color="#dc3545" />
              <View style={styles.levelOptionText}>
                <Text style={styles.levelOptionTitle}>Avançado</Text>
                <Text style={styles.levelOptionDescription}>Treinos intensos e técnicas avançadas</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLevelModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Timer de Descanso */}
      <Modal
        visible={timerModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleStopTimer}
      >
        <View style={styles.timerOverlay}>
          <View style={styles.timerModal}>
            <Text style={styles.timerTitle}>⏱️ Descanso</Text>
            <Text style={styles.timerTime}>{formatTime(timerSeconds)}</Text>

            <View style={styles.timerButtons}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => handleAddTime(30)}
              >
                <Ionicons name="add" size={20} color="#276999" />
                <Text style={styles.timerButtonText}>+30s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => handleAddTime(-30)}
                disabled={timerSeconds <= 30}
              >
                <Ionicons name="remove" size={20} color="#276999" />
                <Text style={styles.timerButtonText}>-30s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timerButton, styles.stopButton]}
                onPress={handleStopTimer}
              >
                <Ionicons name="stop" size={20} color="#fff" />
                <Text style={[styles.timerButtonText, { color: '#fff' }]}>Parar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timerProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.max(0, Math.min(100, (timerSeconds / 120) * 100))}%`,
                      backgroundColor: timerSeconds <= 10 ? '#dc3545' : timerSeconds <= 30 ? '#ffc107' : '#28a745'
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {timerSeconds <= 10 ? '🔥 Quase lá!' : timerSeconds <= 30 ? '⚡ Prepare-se!' : '💪 Descansando...'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Vídeo */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeVideoModal}
      >
        <View style={styles.videoModal}>
          <View style={styles.videoModalHeader}>
            <Text style={styles.videoModalTitle} numberOfLines={2}>
              {selectedVideo?.title || 'Carregando...'}
            </Text>
            <TouchableOpacity onPress={closeVideoModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loadingVideo ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#276999" />
              <Text style={styles.loadingText}>Carregando vídeo...</Text>
            </View>
          ) : (
            <>
              {selectedVideo?.id && (
                <View style={styles.videoContainer}>
                  <YoutubePlayer
                    height={Platform.OS === 'web' ? 500 : 220}
                    videoId={selectedVideo.id}
                    play={false}
                  />
                </View>
              )}

              {selectedVideo && (
                <ScrollView style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
                  <Text style={styles.videoChannel}>📺 {selectedVideo.channelTitle}</Text>

                  <View style={styles.videoActions}>
                    <TouchableOpacity
                      style={styles.videoActionButton}
                      onPress={() => {
                        const url = selectedVideo?.url;
                        if (url) {
                          if (Platform.OS === 'web') {
                            window.open(url, '_blank');
                          } else {
                            const { Linking } = require('react-native');
                            Linking.openURL(url).catch(err => {
                              console.error('Erro ao abrir URL:', err);
                              Alert.alert('Erro', 'Não foi possível abrir o vídeo');
                            });
                          }
                        } else {
                          Alert.alert('Erro', 'URL do vídeo não disponível');
                        }
                      }}
                    >
                      <Ionicons name="logo-youtube" size={20} color="#ff0000" />
                      <Text style={styles.videoActionText}>Abrir no YouTube</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.videoActionButton}
                      onPress={() => {
                        const videoUrl = selectedVideo?.url;
                        const videoTitle = selectedVideo?.title;

                        if (Platform.OS === 'web') {
                          if (navigator.share && videoUrl) {
                            navigator.share({
                              title: videoTitle,
                              text: `Confira este vídeo: ${videoTitle}`,
                              url: videoUrl
                            });
                          } else if (videoUrl) {
                            navigator.clipboard.writeText(videoUrl);
                            Alert.alert('Link copiado!', 'O link do vídeo foi copiado para a área de transferência.');
                          }
                        } else {
                          const { Share } = require('react-native');
                          if (videoUrl && videoTitle) {
                            Share.share({
                              message: `Confira este vídeo: ${videoTitle}\n${videoUrl}`,
                              url: videoUrl,
                              title: videoTitle
                            });
                          } else {
                            Alert.alert('Erro', 'Não foi possível compartilhar o vídeo');
                          }
                        }
                      }}
                    >
                      <Ionicons name="share-outline" size={20} color="#276999" />
                      <Text style={styles.videoActionText}>Compartilhar</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.videoDescription} numberOfLines={6}>
                    {selectedVideo.description || 'Sem descrição disponível.'}
                  </Text>
                </ScrollView>
              )}
            </>
          )}
        </View>
      </Modal>

      {/* Modal Calendário de Progresso */}
      <Modal
        visible={calendarModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.calendarModal}>
          <View style={styles.calendarModalHeader}>
            <Text style={styles.calendarModalTitle}>Progresso Semanal</Text>
            <TouchableOpacity onPress={() => setCalendarModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.calendarContent}>
            {/* Resumo da Semana */}
            <View style={styles.weekSummary}>
              <Text style={styles.weekSummaryTitle}>Resumo da Semana</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>
                    {calendarDays.filter((_, index) => getDayStatus(index) === 'completed').length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Dias Completos</Text>
                </View>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>
                    {calendarDays.filter((_, index) => getDayStatus(index) === 'partial').length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Dias Parciais</Text>
                </View>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatNumber}>
                    {[...completedExercises].length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Exercícios Feitos</Text>
                </View>
              </View>
            </View>

            {/* Detalhes por Dia */}
            {calendarDays.map((day, index) => {
              const dayWorkout = ExerciseDatabase.getWorkoutForDay(index, workoutType, forceLevel);
              const completedCount = [...completedExercises].filter(id => id.startsWith(`${index}_`)).length;
              const totalExercises = dayWorkout.exercises.length;
              const completionRate = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;
              const status = getDayStatus(index);
              const statusIcon = getStatusIcon(status);

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.calendarDayItem}
                  onPress={() => {
                    setSelectedDay(index);
                    setCalendarModalVisible(false);
                  }}
                >
                  <View style={styles.calendarDayHeader}>
                    <View style={styles.calendarDayInfo}>
                      <Text style={styles.calendarDayName}>{day.name} - {day.number}</Text>
                      {day.isToday && <Text style={styles.todayLabel}>Hoje</Text>}
                    </View>
                    <View style={styles.calendarDayStatus}>
                      <Ionicons
                        name={statusIcon.name}
                        size={20}
                        color={statusIcon.color}
                      />
                    </View>
                  </View>

                  <Text style={styles.calendarWorkoutTitle}>{dayWorkout.title}</Text>

                  {totalExercises > 0 ? (
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressText}>
                        {completedCount}/{totalExercises} exercícios concluídos
                      </Text>
                      <View style={styles.progressBarContainer}>
                        <View style={[
                          styles.progressBarFill,
                          {
                            width: `${completionRate}%`,
                            backgroundColor:
                              completionRate === 100 ? '#28a745' :
                                completionRate >= 50 ? '#ffc107' : '#dc3545'
                          }
                        ]} />
                      </View>
                      <Text style={styles.progressPercentage}>{Math.round(completionRate)}%</Text>
                    </View>
                  ) : (
                    <Text style={styles.restDayText}>Dia de descanso</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Editar Exercício */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.editModal}>
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Editar Exercício</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Exercício *</Text>
              <TextInput
                style={styles.textInput}
                value={editingExerciseData?.name || ''}
                onChangeText={(text) => setEditingExerciseData({ ...editingExerciseData, name: text })}
                placeholder="Ex: Supino Reto"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Séries e Repetições</Text>
              <TextInput
                style={styles.textInput}
                value={editingExerciseData?.sets || ''}
                onChangeText={(text) => setEditingExerciseData({ ...editingExerciseData, sets: text })}
                placeholder="Ex: 3x12 ou 4x8-10"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Descanso</Text>
              <TextInput
                style={styles.textInput}
                value={editingExerciseData?.rest || ''}
                onChangeText={(text) => setEditingExerciseData({ ...editingExerciseData, rest: text })}
                placeholder="Ex: 90s ou 2min"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Grupo Muscular</Text>
              <TextInput
                style={styles.textInput}
                value={editingExerciseData?.muscle || ''}
                onChangeText={(text) => setEditingExerciseData({ ...editingExerciseData, muscle: text })}
                placeholder="Ex: Peito, Costas, Pernas"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveEditedExercise}
              >
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Adicionar Exercício */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.editModal}>
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Adicionar Exercício</Text>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Exercício *</Text>
              <TextInput
                style={styles.textInput}
                value={newExercise.name}
                onChangeText={(text) => setNewExercise({ ...newExercise, name: text })}
                placeholder="Ex: Supino Reto"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Séries e Repetições</Text>
              <TextInput
                style={styles.textInput}
                value={newExercise.sets}
                onChangeText={(text) => setNewExercise({ ...newExercise, sets: text })}
                placeholder="Ex: 3x12 ou 4x8-10"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Descanso</Text>
              <TextInput
                style={styles.textInput}
                value={newExercise.rest}
                onChangeText={(text) => setNewExercise({ ...newExercise, rest: text })}
                placeholder="Ex: 90s ou 2min"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Grupo Muscular</Text>
              <TextInput
                style={styles.textInput}
                value={newExercise.muscle}
                onChangeText={(text) => setNewExercise({ ...newExercise, muscle: text })}
                placeholder="Ex: Peito, Costas, Pernas"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveNewExercise}
              >
                <Text style={styles.saveButtonText}>Adicionar Exercício</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}



