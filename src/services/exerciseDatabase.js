import AsyncStorage from '@react-native-async-storage/async-storage';

class ExerciseDatabase {
  constructor() {
    this.userStartDate = null;
    this.customExercises = new Map(); // Para armazenar exercícios personalizados
    this.initializeUserData();
  }

  async initializeUserData() {
    try {
      const startDate = await AsyncStorage.getItem('user_start_date');
      if (!startDate) {
        const now = new Date().toISOString();
        await AsyncStorage.setItem('user_start_date', now);
        this.userStartDate = new Date(now);
      } else {
        this.userStartDate = new Date(startDate);
      }

      // Carregar exercícios customizados
      const customExercises = await AsyncStorage.getItem('custom_exercises');
      if (customExercises) {
        const parsed = JSON.parse(customExercises);
        this.customExercises = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Erro ao inicializar dados do usuário:', error);
      this.userStartDate = new Date();
    }
  }

  // Salvar exercícios customizados
  async saveCustomExercises() {
    try {
      const exercisesObj = Object.fromEntries(this.customExercises);
      await AsyncStorage.setItem('custom_exercises', JSON.stringify(exercisesObj));
    } catch (error) {
      console.error('Erro ao salvar exercícios customizados:', error);
    }
  }

  // Adicionar/editar exercício customizado
  async updateCustomExercise(dayIndex, exerciseIndex, exerciseData, workoutType = 'gym', level = null) {
    const currentLevel = level || this.getCurrentLevel();
    const key = `${currentLevel}_${workoutType}_${dayIndex}_${exerciseIndex}`;
    this.customExercises.set(key, exerciseData);
    await this.saveCustomExercises();
  }

  // Remover exercício customizado
  async removeCustomExercise(dayIndex, exerciseIndex, workoutType = 'gym', level = null) {
    const currentLevel = level || this.getCurrentLevel();
    const key = `${currentLevel}_${workoutType}_${dayIndex}_${exerciseIndex}`;
    this.customExercises.delete(key);
    await this.saveCustomExercises();
  }

  // Adicionar novo exercício
  async addNewExercise(dayIndex, exerciseData, workoutType = 'gym', level = null) {
    const currentLevel = level || this.getCurrentLevel();
    const workout = this.getWorkoutForDay(dayIndex, workoutType, currentLevel);
    const newIndex = workout.exercises.length;
    const key = `${currentLevel}_${workoutType}_${dayIndex}_new_${newIndex}`;
    this.customExercises.set(key, { ...exerciseData, isNew: true });
    await this.saveCustomExercises();
  }

  getCurrentLevel() {
    if (!this.userStartDate) return 'beginner';

    const now = new Date();
    const diffTime = Math.abs(now - this.userStartDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) return 'beginner';        // 1 mês
    if (diffDays <= 75) return 'intermediate';    // 1.5 meses
    return 'advanced';                            // Resto
  }

  getWorkoutForDay(dayIndex, workoutType = 'gym', forceLevel = null) {
    const level = forceLevel || this.getCurrentLevel();
    const baseWorkout = this.workoutPlans[level][workoutType][dayIndex] || { title: 'Descanso', exercises: [] };

    // Aplicar customizações
    const customizedWorkout = { ...baseWorkout };
    customizedWorkout.exercises = [...baseWorkout.exercises];

    // Aplicar exercícios editados
    customizedWorkout.exercises = customizedWorkout.exercises.map((exercise, index) => {
      const key = `${level}_${workoutType}_${dayIndex}_${index}`;
      return this.customExercises.get(key) || exercise;
    });

    // Adicionar novos exercícios
    for (const [key, exercise] of this.customExercises.entries()) {
      if (key.startsWith(`${level}_${workoutType}_${dayIndex}_new_`) && exercise.isNew) {
        customizedWorkout.exercises.push(exercise);
      }
    }

    return customizedWorkout;
  }

  getLevelInfo(forceLevel = null) {
    const level = forceLevel || this.getCurrentLevel();
    const info = {
      beginner: {
        title: 'Nível Iniciante',
        description: 'Primeiros 30 dias - Aprendendo os movimentos',
        duration: '30 dias'
      },
      intermediate: {
        title: 'Nível Intermediário',
        description: 'Dias 31-75 - Aumentando intensidade',
        duration: '45 dias'
      },
      advanced: {
        title: 'Nível Avançado',
        description: 'Dia 76+ - Treinos intensos e variados',
        duration: 'Contínuo'
      }
    };

    return { type: level, ...info[level] };
  }

  workoutPlans = {
    beginner: {
      gym: {
        0: { // Segunda
          title: 'Peito e Tríceps - Iniciante',
          exercises: [
            { name: 'Supino Reto', sets: '3x10', rest: '90s', muscle: 'Peito' },
            { name: 'Supino Inclinado', sets: '2x8', rest: '90s', muscle: 'Peito' },
            { name: 'Tríceps Pulley', sets: '3x10', rest: '60s', muscle: 'Tríceps' },
            { name: 'Tríceps Testa', sets: '2x10', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: { // Terça
          title: 'Costas e Bíceps - Iniciante',
          exercises: [
            { name: 'Puxada Frontal', sets: '3x10', rest: '90s', muscle: 'Costas' },
            { name: 'Remada Sentada', sets: '3x8', rest: '90s', muscle: 'Costas' },
            { name: 'Rosca Direta', sets: '3x10', rest: '60s', muscle: 'Bíceps' },
            { name: 'Rosca Martelo', sets: '2x10', rest: '60s', muscle: 'Bíceps' },
          ]
        },
        2: { // Quarta
          title: 'Pernas - Iniciante',
          exercises: [
            { name: 'Leg Press', sets: '3x12', rest: '2min', muscle: 'Pernas' },
            { name: 'Extensora', sets: '3x12', rest: '90s', muscle: 'Quadríceps' },
            { name: 'Flexora', sets: '3x10', rest: '90s', muscle: 'Posterior' },
            { name: 'Panturrilha', sets: '3x15', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: { // Quinta
          title: 'Ombros - Iniciante',
          exercises: [
            { name: 'Desenvolvimento', sets: '3x10', rest: '90s', muscle: 'Ombros' },
            { name: 'Elevação Lateral', sets: '3x12', rest: '60s', muscle: 'Ombros' },
            { name: 'Elevação Posterior', sets: '2x10', rest: '60s', muscle: 'Ombros' },
            { name: 'Encolhimento', sets: '3x12', rest: '60s', muscle: 'Trapézio' },
          ]
        },
        4: { // Sexta
          title: 'Corpo Todo - Iniciante',
          exercises: [
            { name: 'Supino', sets: '2x8', rest: '90s', muscle: 'Peito' },
            { name: 'Puxada', sets: '2x8', rest: '90s', muscle: 'Costas' },
            { name: 'Leg Press', sets: '2x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Desenvolvimento', sets: '2x8', rest: '90s', muscle: 'Ombros' },
          ]
        },
        5: { // Sábado
          title: 'Cardio Leve',
          exercises: [
            { name: 'Esteira', sets: '20min', rest: '-', muscle: 'Cardio' },
            { name: 'Bicicleta', sets: '15min', rest: '-', muscle: 'Cardio' },
            { name: 'Alongamento', sets: '10min', rest: '-', muscle: 'Flexibilidade' },
          ]
        },
        6: { title: 'Descanso', exercises: [] }
      },
      home: {
        0: { // Segunda
          title: 'Peito e Tríceps - Casa',
          exercises: [
            { name: 'Flexão de Braço', sets: '3x8', rest: '90s', muscle: 'Peito' },
            { name: 'Flexão Inclinada', sets: '2x6', rest: '90s', muscle: 'Peito' },
            { name: 'Tríceps no Chão', sets: '3x8', rest: '60s', muscle: 'Tríceps' },
            { name: 'Mergulho na Cadeira', sets: '2x8', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: { // Terça
          title: 'Costas e Bíceps - Casa',
          exercises: [
            { name: 'Remada com Toalha', sets: '3x10', rest: '90s', muscle: 'Costas' },
            { name: 'Superman', sets: '3x12', rest: '60s', muscle: 'Costas' },
            { name: 'Rosca com Garrafa', sets: '3x12', rest: '60s', muscle: 'Bíceps' },
            { name: 'Isometria Bíceps', sets: '2x30s', rest: '60s', muscle: 'Bíceps' },
          ]
        },
        2: { // Quarta
          title: 'Pernas - Casa',
          exercises: [
            { name: 'Agachamento', sets: '3x12', rest: '90s', muscle: 'Pernas' },
            { name: 'Lunges', sets: '3x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Agachamento Búlgaro', sets: '2x8', rest: '90s', muscle: 'Pernas' },
            { name: 'Panturrilha em Pé', sets: '3x15', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: { // Quinta
          title: 'Ombros - Casa',
          exercises: [
            { name: 'Flexão Pike', sets: '3x8', rest: '90s', muscle: 'Ombros' },
            { name: 'Elevação Lateral com Garrafa', sets: '3x12', rest: '60s', muscle: 'Ombros' },
            { name: 'Prancha T', sets: '2x8', rest: '60s', muscle: 'Ombros' },
            { name: 'Encolhimento', sets: '3x12', rest: '60s', muscle: 'Trapézio' },
          ]
        },
        4: { // Sexta
          title: 'Corpo Todo - Casa',
          exercises: [
            { name: 'Burpees', sets: '3x5', rest: '90s', muscle: 'Corpo Todo' },
            { name: 'Mountain Climbers', sets: '3x20', rest: '60s', muscle: 'Corpo Todo' },
            { name: 'Prancha', sets: '3x30s', rest: '60s', muscle: 'Core' },
            { name: 'Jumping Jacks', sets: '3x20', rest: '60s', muscle: 'Cardio' },
          ]
        },
        5: { // Sábado
          title: 'Cardio Casa',
          exercises: [
            { name: 'Corrida Estacionária', sets: '20min', rest: '-', muscle: 'Cardio' },
            { name: 'Pular Corda', sets: '10min', rest: '-', muscle: 'Cardio' },
            { name: 'Alongamento', sets: '10min', rest: '-', muscle: 'Flexibilidade' },
          ]
        },
        6: { title: 'Descanso', exercises: [] }
      },
      outdoor: {
        0: { // Segunda
          title: 'Peito e Tríceps - Ar Livre',
          exercises: [
            { name: 'Flexão no Banco', sets: '3x8', rest: '90s', muscle: 'Peito' },
            { name: 'Flexão Inclinada', sets: '2x6', rest: '90s', muscle: 'Peito' },
            { name: 'Mergulho no Banco', sets: '3x8', rest: '60s', muscle: 'Tríceps' },
            { name: 'Tríceps na Parede', sets: '2x10', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: { // Terça
          title: 'Costas e Bíceps - Ar Livre',
          exercises: [
            { name: 'Barra Fixa Assistida', sets: '3x5', rest: '2min', muscle: 'Costas' },
            { name: 'Remada Invertida', sets: '3x8', rest: '90s', muscle: 'Costas' },
            { name: 'Rosca na Barra', sets: '2x6', rest: '90s', muscle: 'Bíceps' },
            { name: 'Isometria Barra', sets: '2x20s', rest: '60s', muscle: 'Bíceps' },
          ]
        },
        2: { // Quarta
          title: 'Pernas - Ar Livre',
          exercises: [
            { name: 'Agachamento no Banco', sets: '3x12', rest: '90s', muscle: 'Pernas' },
            { name: 'Lunges Caminhando', sets: '3x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Step Up', sets: '3x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Panturrilha no Degrau', sets: '3x15', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: { // Quinta
          title: 'Ombros - Ar Livre',
          exercises: [
            { name: 'Flexão Pike Elevada', sets: '3x8', rest: '90s', muscle: 'Ombros' },
            { name: 'Caminhada do Urso', sets: '3x20s', rest: '60s', muscle: 'Ombros' },
            { name: 'Prancha Lateral', sets: '2x20s', rest: '60s', muscle: 'Ombros' },
            { name: 'Polichinelo', sets: '3x15', rest: '60s', muscle: 'Ombros' },
          ]
        },
        4: { // Sexta
          title: 'Funcional - Ar Livre',
          exercises: [
            { name: 'Circuito Funcional', sets: '3x', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Corrida Intervalada', sets: '5x1min', rest: '1min', muscle: 'Cardio' },
            { name: 'Exercícios na Barra', sets: '3x', rest: '90s', muscle: 'Corpo Todo' },
          ]
        },
        5: { // Sábado
          title: 'Cardio Ar Livre',
          exercises: [
            { name: 'Corrida', sets: '25min', rest: '-', muscle: 'Cardio' },
            { name: 'Caminhada', sets: '15min', rest: '-', muscle: 'Cardio' },
            { name: 'Alongamento', sets: '10min', rest: '-', muscle: 'Flexibilidade' },
          ]
        },
        6: { title: 'Descanso', exercises: [] }
      }
    },

    intermediate: {
      gym: {
        0: {
          title: 'Peito e Tríceps - Intermediário',
          exercises: [
            { name: 'Supino Reto', sets: '4x10', rest: '90s', muscle: 'Peito' },
            { name: 'Supino Inclinado', sets: '3x8', rest: '90s', muscle: 'Peito' },
            { name: 'Crucifixo', sets: '3x10', rest: '60s', muscle: 'Peito' },
            { name: 'Tríceps Testa', sets: '4x10', rest: '60s', muscle: 'Tríceps' },
            { name: 'Tríceps Pulley', sets: '3x12', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: {
          title: 'Costas e Bíceps - Intermediário',
          exercises: [
            { name: 'Puxada Frontal', sets: '4x10', rest: '90s', muscle: 'Costas' },
            { name: 'Remada Curvada', sets: '4x8', rest: '90s', muscle: 'Costas' },
            { name: 'Remada Unilateral', sets: '3x10', rest: '90s', muscle: 'Costas' },
            { name: 'Rosca Direta', sets: '4x10', rest: '60s', muscle: 'Bíceps' },
            { name: 'Rosca Martelo', sets: '3x12', rest: '60s', muscle: 'Bíceps' },
          ]
        },
        2: {
          title: 'Pernas - Intermediário',
          exercises: [
            { name: 'Agachamento Livre', sets: '4x12', rest: '2min', muscle: 'Pernas' },
            { name: 'Leg Press', sets: '4x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Extensora', sets: '3x12', rest: '90s', muscle: 'Quadríceps' },
            { name: 'Flexora', sets: '3x10', rest: '90s', muscle: 'Posterior' },
            { name: 'Panturrilha', sets: '4x15', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: {
          title: 'Ombros e Trapézio - Intermediário',
          exercises: [
            { name: 'Desenvolvimento', sets: '4x10', rest: '90s', muscle: 'Ombros' },
            { name: 'Elevação Lateral', sets: '4x12', rest: '60s', muscle: 'Ombros' },
            { name: 'Elevação Posterior', sets: '3x10', rest: '60s', muscle: 'Ombros' },
            { name: 'Desenvolvimento Arnold', sets: '3x8', rest: '90s', muscle: 'Ombros' },
            { name: 'Encolhimento', sets: '4x12', rest: '60s', muscle: 'Trapézio' },
          ]
        },
        4: {
          title: 'Braços - Intermediário',
          exercises: [
            { name: 'Rosca Bíceps', sets: '4x10', rest: '60s', muscle: 'Bíceps' },
            { name: 'Tríceps Francês', sets: '4x10', rest: '60s', muscle: 'Tríceps' },
            { name: 'Rosca Concentrada', sets: '3x8', rest: '60s', muscle: 'Bíceps' },
            { name: 'Tríceps Coice', sets: '3x12', rest: '60s', muscle: 'Tríceps' },
            { name: 'Rosca 21', sets: '2x21', rest: '90s', muscle: 'Bíceps' },
          ]
        },
        5: {
          title: 'Cardio e Core - Intermediário',
          exercises: [
            { name: 'Esteira HIIT', sets: '20min', rest: '-', muscle: 'Cardio' },
            { name: 'Prancha', sets: '3x45s', rest: '30s', muscle: 'Core' },
            { name: 'Abdominal', sets: '4x15', rest: '30s', muscle: 'Core' },
            { name: 'Russian Twist', sets: '3x20', rest: '30s', muscle: 'Core' },
          ]
        },
        6: { title: 'Descanso', exercises: [] }
      },
      home: {
        // Exercícios intermediários para casa...
        0: {
          title: 'Peito e Tríceps - Casa Intermediário',
          exercises: [
            { name: 'Flexão Diamante', sets: '4x8', rest: '90s', muscle: 'Peito' },
            { name: 'Flexão Declinada', sets: '3x6', rest: '90s', muscle: 'Peito' },
            { name: 'Flexão Larga', sets: '3x10', rest: '90s', muscle: 'Peito' },
            { name: 'Tríceps no Chão', sets: '4x10', rest: '60s', muscle: 'Tríceps' },
            { name: 'Mergulho Cadeira', sets: '3x12', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: {
          title: 'Costas e Bíceps - Casa Intermediário',
          exercises: [
            { name: 'Remada com Toalha', sets: '4x12', rest: '90s', muscle: 'Costas' },
            { name: 'Superman', sets: '4x15', rest: '60s', muscle: 'Costas' },
            { name: 'Ponte', sets: '3x12', rest: '90s', muscle: 'Costas' },
            { name: 'Rosca com Peso', sets: '4x12', rest: '60s', muscle: 'Bíceps' },
            { name: 'Rosca Isométrica', sets: '3x30s', rest: '60s', muscle: 'Bíceps' },
          ]
        },
        2: {
          title: 'Pernas - Casa Intermediário',
          exercises: [
            { name: 'Agachamento Jump', sets: '4x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Lunges Alternados', sets: '4x12', rest: '90s', muscle: 'Pernas' },
            { name: 'Agachamento Pistol', sets: '3x5', rest: '2min', muscle: 'Pernas' },
            { name: 'Cossaco', sets: '3x8', rest: '90s', muscle: 'Pernas' },
            { name: 'Panturrilha Jump', sets: '4x15', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: {
          title: 'Ombros - Casa Intermediário',
          exercises: [
            { name: 'Flexão Pike', sets: '4x8', rest: '90s', muscle: 'Ombros' },
            { name: 'Caminhada do Urso', sets: '3x30s', rest: '60s', muscle: 'Ombros' },
            { name: 'Prancha T', sets: '3x8', rest: '60s', muscle: 'Ombros' },
            { name: 'Elevação com Peso', sets: '4x12', rest: '60s', muscle: 'Ombros' },
            { name: 'Handstand Prep', sets: '3x20s', rest: '90s', muscle: 'Ombros' },
          ]
        },
        4: {
          title: 'HIIT - Casa Intermediário',
          exercises: [
            { name: 'Burpees', sets: '4x8', rest: '90s', muscle: 'Corpo Todo' },
            { name: 'Mountain Climbers', sets: '4x30s', rest: '60s', muscle: 'Corpo Todo' },
            { name: 'Jump Squat', sets: '4x12', rest: '90s', muscle: 'Pernas' },
            { name: 'Prancha Dinâmica', sets: '3x30s', rest: '60s', muscle: 'Core' },
            { name: 'High Knees', sets: '4x30s', rest: '60s', muscle: 'Cardio' },
          ]
        },
        5: {
          title: 'Core e Cardio - Casa',
          exercises: [
            { name: 'Tabata', sets: '20min', rest: '-', muscle: 'Cardio' },
            { name: 'Prancha Variações', sets: '4x45s', rest: '30s', muscle: 'Core' },
            { name: 'Abdominal Bicicleta', sets: '4x20', rest: '30s', muscle: 'Core' },
            { name: 'V-Ups', sets: '3x15', rest: '45s', muscle: 'Core' },
          ]
        },
        6: { title: 'Descanso', exercises: [] }
      },
      outdoor: {
        // Exercícios intermediários ao ar livre...
        0: {
          title: 'Peito e Tríceps - Ar Livre Intermediário',
          exercises: [
            { name: 'Flexão no Banco', sets: '4x10', rest: '90s', muscle: 'Peito' },
            { name: 'Flexão Inclinada', sets: '3x8', rest: '90s', muscle: 'Peito' },
            { name: 'Mergulho Paralelas', sets: '4x8', rest: '90s', muscle: 'Tríceps' },
            { name: 'Flexão Diamante', sets: '3x6', rest: '90s', muscle: 'Tríceps' },
            { name: 'Tríceps Banco', sets: '3x12', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: {
          title: 'Costas e Bíceps - Ar Livre Intermediário',
          exercises: [
            { name: 'Barra Fixa', sets: '4x6', rest: '2min', muscle: 'Costas' },
            { name: 'Remada Invertida', sets: '4x10', rest: '90s', muscle: 'Costas' },
            { name: 'Barra Pegada Supina', sets: '3x5', rest: '2min', muscle: 'Bíceps' },
            { name: 'Isometria Barra', sets: '3x30s', rest: '90s', muscle: 'Bíceps' },
            { name: 'Australian Pull-up', sets: '3x8', rest: '90s', muscle: 'Costas' },
          ]
        },
        2: {
          title: 'Pernas - Ar Livre Intermediário',
          exercises: [
            { name: 'Agachamento Jump', sets: '4x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Lunges Explosivos', sets: '4x8', rest: '90s', muscle: 'Pernas' },
            { name: 'Step Up Alto', sets: '3x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Agachamento Búlgaro', sets: '3x8', rest: '90s', muscle: 'Pernas' },
            { name: 'Panturrilha Unilateral', sets: '4x12', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: {
          title: 'Funcional - Ar Livre Intermediário',
          exercises: [
            { name: 'Muscle Up Prep', sets: '4x3', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Handstand Walk', sets: '3x10s', rest: '90s', muscle: 'Ombros' },
            { name: 'Bear Crawl', sets: '3x20s', rest: '60s', muscle: 'Corpo Todo' },
            { name: 'Crab Walk', sets: '3x15s', rest: '60s', muscle: 'Corpo Todo' },
            { name: 'Farmer Walk', sets: '3x30s', rest: '90s', muscle: 'Corpo Todo' },
          ]
        },
        4: {
          title: 'HIIT - Ar Livre Intermediário',
          exercises: [
            { name: 'Sprint Intervalado', sets: '8x30s', rest: '30s', muscle: 'Cardio' },
            { name: 'Burpee Box Jump', sets: '4x6', rest: '90s', muscle: 'Corpo Todo' },
            { name: 'Battle Ropes', sets: '4x30s', rest: '60s', muscle: 'Corpo Todo' },
            { name: 'Tire Flips', sets: '3x8', rest: '2min', muscle: 'Corpo Todo' },
          ]
        },
        5: {
          title: 'Cardio - Ar Livre Intermediário',
          exercises: [
            { name: 'Corrida Intervalada', sets: '30min', rest: '-', muscle: 'Cardio' },
            { name: 'Circuito Funcional', sets: '4x', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Alongamento', sets: '15min', rest: '-', muscle: 'Flexibilidade' },
          ]
        },
        6: { title: 'Descanso', exercises: [] }
      }
    },

    advanced: {
      gym: {
        0: {
          title: 'Peito e Tríceps - Avançado',
          exercises: [
            { name: 'Supino Reto', sets: '5x8', rest: '2min', muscle: 'Peito' },
            { name: 'Supino Inclinado', sets: '4x8', rest: '90s', muscle: 'Peito' },
            { name: 'Supino Declinado', sets: '3x10', rest: '90s', muscle: 'Peito' },
            { name: 'Crucifixo', sets: '4x10', rest: '60s', muscle: 'Peito' },
            { name: 'Tríceps Testa', sets: '4x8', rest: '90s', muscle: 'Tríceps' },
            { name: 'Tríceps Pulley', sets: '4x10', rest: '60s', muscle: 'Tríceps' },
            { name: 'Tríceps Coice', sets: '3x12', rest: '60s', muscle: 'Tríceps' },
          ]
        },
        1: {
          title: 'Costas e Bíceps - Avançado',
          exercises: [
            { name: 'Barra Fixa', sets: '5x8', rest: '2min', muscle: 'Costas' },
            { name: 'Puxada Frontal', sets: '4x8', rest: '90s', muscle: 'Costas' },
            { name: 'Remada Curvada', sets: '4x8', rest: '90s', muscle: 'Costas' },
            { name: 'Remada T-Bar', sets: '4x10', rest: '90s', muscle: 'Costas' },
            { name: 'Pullover', sets: '3x12', rest: '60s', muscle: 'Costas' },
            { name: 'Rosca Direta', sets: '4x8', rest: '90s', muscle: 'Bíceps' },
            { name: 'Rosca Martelo', sets: '4x10', rest: '60s', muscle: 'Bíceps' },
            { name: 'Rosca 21', sets: '3x21', rest: '90s', muscle: 'Bíceps' },
          ]
        },
        2: {
          title: 'Pernas - Avançado',
          exercises: [
            { name: 'Agachamento Livre', sets: '5x8', rest: '3min', muscle: 'Pernas' },
            { name: 'Leg Press', sets: '4x12', rest: '2min', muscle: 'Pernas' },
            { name: 'Hack Squat', sets: '4x10', rest: '2min', muscle: 'Pernas' },
            { name: 'Extensora', sets: '4x12', rest: '90s', muscle: 'Quadríceps' },
            { name: 'Flexora', sets: '4x10', rest: '90s', muscle: 'Posterior' },
            { name: 'Stiff', sets: '4x8', rest: '90s', muscle: 'Posterior' },
            { name: 'Panturrilha', sets: '5x15', rest: '60s', muscle: 'Panturrilha' },
          ]
        },
        3: {
          title: 'Ombros e Trapézio - Avançado',
          exercises: [
            { name: 'Desenvolvimento', sets: '5x8', rest: '2min', muscle: 'Ombros' },
            { name: 'Desenvolvimento Arnold', sets: '4x8', rest: '90s', muscle: 'Ombros' },
            { name: 'Elevação Lateral', sets: '4x12', rest: '60s', muscle: 'Ombros' },
            { name: 'Elevação Frontal', sets: '3x10', rest: '60s', muscle: 'Ombros' },
            { name: 'Elevação Posterior', sets: '4x10', rest: '60s', muscle: 'Ombros' },
            { name: 'Encolhimento', sets: '4x12', rest: '90s', muscle: 'Trapézio' },
            { name: 'Upright Row', sets: '3x10', rest: '60s', muscle: 'Trapézio' },
          ]
        },
        4: {
          title: 'Braços - Avançado',
          exercises: [
            { name: 'Rosca Bíceps', sets: '5x8', rest: '90s', muscle: 'Bíceps' },
            { name: 'Tríceps Francês', sets: '5x8', rest: '90s', muscle: 'Tríceps' },
            { name: 'Rosca Concentrada', sets: '4x8', rest: '60s', muscle: 'Bíceps' },
            { name: 'Tríceps Mergulho', sets: '4x10', rest: '90s', muscle: 'Tríceps' },
            { name: 'Rosca Martelo', sets: '4x10', rest: '60s', muscle: 'Bíceps' },
            { name: 'Tríceps Supino Fechado', sets: '4x8', rest: '90s', muscle: 'Tríceps' },
          ]
        },
        5: {
          title: 'Push/Pull - Avançado',
          exercises: [
            { name: 'Supino + Remada', sets: '4x8', rest: '2min', muscle: 'Peito/Costas' },
            { name: 'Desenvolvimento + Puxada', sets: '4x8', rest: '2min', muscle: 'Ombros/Costas' },
            { name: 'Rosca + Tríceps', sets: '4x10', rest: '90s', muscle: 'Braços' },
            { name: 'Agachamento + Flexão', sets: '3x10', rest: '2min', muscle: 'Corpo Todo' },
          ]
        },
        6: {
          title: 'HIIT + Core - Avançado',
          exercises: [
            { name: 'Circuito HIIT', sets: '30min', rest: '-', muscle: 'Cardio' },
            { name: 'Prancha Variações', sets: '5x60s', rest: '30s', muscle: 'Core' },
            { name: 'Russian Twist', sets: '4x25', rest: '30s', muscle: 'Core' },
            { name: 'Dragon Flag', sets: '3x5', rest: '90s', muscle: 'Core' },
          ]
        }
      },
      home: {
        0: {
          title: 'Peito e Tríceps - Casa Avançado',
          exercises: [
            { name: 'Flexão Arqueiro', sets: '4x6', rest: '2min', muscle: 'Peito' },
            { name: 'Flexão Uma Mão', sets: '3x3', rest: '3min', muscle: 'Peito' },
            { name: 'Flexão Explosiva', sets: '4x5', rest: '2min', muscle: 'Peito' },
            { name: 'Handstand Push-up', sets: '3x5', rest: '2min', muscle: 'Ombros' },
            { name: 'Tríceps Diamante', sets: '4x8', rest: '90s', muscle: 'Tríceps' },
            { name: 'Pike Push-up', sets: '4x8', rest: '90s', muscle: 'Ombros' },
          ]
        },
        1: {
          title: 'Costas e Bíceps - Casa Avançado',
          exercises: [
            { name: 'Muscle Up', sets: '4x3', rest: '3min', muscle: 'Costas/Braços' },
            { name: 'Barra Fixa L-Sit', sets: '3x5', rest: '2min', muscle: 'Costas/Core' },
            { name: 'Remada Invertida', sets: '5x10', rest: '90s', muscle: 'Costas' },
            { name: 'Superman Dinâmico', sets: '4x15', rest: '60s', muscle: 'Costas' },
            { name: 'Rosca Isométrica', sets: '4x45s', rest: '90s', muscle: 'Bíceps' },
          ]
        },
        2: {
          title: 'Pernas - Casa Avançado',
          exercises: [
            { name: 'Pistol Squat', sets: '4x5', rest: '2min', muscle: 'Pernas' },
            { name: 'Jump Squat', sets: '5x8', rest: '90s', muscle: 'Pernas' },
            { name: 'Shrimp Squat', sets: '3x3', rest: '2min', muscle: 'Pernas' },
            { name: 'Lunges Jump', sets: '4x10', rest: '90s', muscle: 'Pernas' },
            { name: 'Cossaco Avançado', sets: '4x8', rest: '90s', muscle: 'Pernas' },
            { name: 'Single Leg RDL', sets: '4x8', rest: '90s', muscle: 'Posterior' },
          ]
        },
        3: {
          title: 'Funcional - Casa Avançado',
          exercises: [
            { name: 'Burpee Muscle Up', sets: '4x5', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Handstand Walk', sets: '3x20s', rest: '2min', muscle: 'Ombros' },
            { name: 'Human Flag Prep', sets: '3x10s', rest: '2min', muscle: 'Core' },
            { name: 'Planche Lean', sets: '4x20s', rest: '90s', muscle: 'Ombros' },
            { name: 'L-Sit', sets: '4x20s', rest: '90s', muscle: 'Core' },
          ]
        },
        4: {
          title: 'HIIT Extremo - Casa',
          exercises: [
            { name: 'Tabata Extremo', sets: '8x4min', rest: '1min', muscle: 'Cardio' },
            { name: 'Burpee Variações', sets: '5x10', rest: '90s', muscle: 'Corpo Todo' },
            { name: 'Mountain Climber', sets: '5x45s', rest: '60s', muscle: 'Cardio' },
            { name: 'Sprawls', sets: '4x15', rest: '90s', muscle: 'Corpo Todo' },
          ]
        },
        5: {
          title: 'Core Extremo - Casa',
          exercises: [
            { name: 'Dragon Flag', sets: '4x5', rest: '2min', muscle: 'Core' },
            { name: 'Front Lever', sets: '3x10s', rest: '2min', muscle: 'Core' },
            { name: 'V-Sit Hold', sets: '4x30s', rest: '90s', muscle: 'Core' },
            { name: 'Hollow Body', sets: '4x45s', rest: '60s', muscle: 'Core' },
            { name: 'Windshield Wipers', sets: '3x10', rest: '90s', muscle: 'Core' },
          ]
        },
        6: {
          title: 'Descanso Ativo', exercises: [
            { name: 'Yoga Flow', sets: '30min', rest: '-', muscle: 'Flexibilidade' },
            { name: 'Meditação', sets: '15min', rest: '-', muscle: 'Mental' },
          ]
        }
      },
      outdoor: {
        0: {
          title: 'Calistenia - Ar Livre Avançado',
          exercises: [
            { name: 'Muscle Up', sets: '5x3', rest: '3min', muscle: 'Corpo Todo' },
            { name: 'Handstand Push-up', sets: '4x5', rest: '2min', muscle: 'Ombros' },
            { name: 'One Arm Pull-up', sets: '3x1', rest: '3min', muscle: 'Costas' },
            { name: 'Planche', sets: '3x10s', rest: '2min', muscle: 'Ombros' },
            { name: 'Human Flag', sets: '3x5s', rest: '2min', muscle: 'Core' },
          ]
        },
        1: {
          title: 'Força - Ar Livre Avançado',
          exercises: [
            { name: 'Weighted Pull-ups', sets: '5x5', rest: '3min', muscle: 'Costas' },
            { name: 'Weighted Dips', sets: '5x8', rest: '2min', muscle: 'Tríceps' },
            { name: 'Pistol Squat', sets: '4x8', rest: '2min', muscle: 'Pernas' },
            { name: 'Archer Pull-ups', sets: '4x6', rest: '2min', muscle: 'Costas' },
            { name: 'Single Arm Push-up', sets: '3x3', rest: '3min', muscle: 'Peito' },
          ]
        },
        2: {
          title: 'Pernas - Ar Livre Avançado',
          exercises: [
            { name: 'Jump Squat Weighted', sets: '5x8', rest: '2min', muscle: 'Pernas' },
            { name: 'Single Leg Squat', sets: '4x6', rest: '2min', muscle: 'Pernas' },
            { name: 'Box Jump Alto', sets: '4x5', rest: '2min', muscle: 'Pernas' },
            { name: 'Broad Jump', sets: '5x3', rest: '2min', muscle: 'Pernas' },
            { name: 'Hill Sprints', sets: '8x30s', rest: '90s', muscle: 'Cardio' },
          ]
        },
        3: {
          title: 'Funcional - Ar Livre Avançado',
          exercises: [
            { name: 'Obstacle Course', sets: '3x', rest: '3min', muscle: 'Corpo Todo' },
            { name: 'Rope Climbing', sets: '4x', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Tire Flips', sets: '4x8', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Sledgehammer', sets: '4x30s', rest: '90s', muscle: 'Corpo Todo' },
            { name: 'Farmer Walk', sets: '4x50m', rest: '2min', muscle: 'Corpo Todo' },
          ]
        },
        4: {
          title: 'Cardio Extremo - Ar Livre',
          exercises: [
            { name: 'Sprint Pyramid', sets: '10x', rest: 'var', muscle: 'Cardio' },
            { name: 'Battle Ropes', sets: '6x45s', rest: '60s', muscle: 'Cardio' },
            { name: 'Burpee Box Jump', sets: '5x8', rest: '90s', muscle: 'Corpo Todo' },
            { name: 'Sled Push', sets: '4x20m', rest: '2min', muscle: 'Pernas' },
          ]
        },
        5: {
          title: 'Resistência - Ar Livre',
          exercises: [
            { name: 'Long Run', sets: '45min', rest: '-', muscle: 'Cardio' },
            { name: 'Circuit Training', sets: '5x', rest: '2min', muscle: 'Corpo Todo' },
            { name: 'Endurance Challenge', sets: '30min', rest: '-', muscle: 'Corpo Todo' },
          ]
        },
        6: {
          title: 'Recovery - Ar Livre',
          exercises: [
            { name: 'Caminhada Leve', sets: '30min', rest: '-', muscle: 'Cardio' },
            { name: 'Alongamento', sets: '20min', rest: '-', muscle: 'Flexibilidade' },
            { name: 'Respiração', sets: '10min', rest: '-', muscle: 'Mental' },
          ]
        }
      }
    }
  };
}

export default new ExerciseDatabase();



