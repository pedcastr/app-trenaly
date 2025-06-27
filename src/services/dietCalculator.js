class DietCalculator {
  // Calcular TMB (Taxa Metabólica Basal)
  static calculateBMR(weight, height, age, gender) {
    if (gender === 'masculino') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  }

  // Calcular calorias diárias baseado no objetivo
  static calculateDailyCalories(bmr, activityLevel, goal) { 
    const activityMultipliers = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      muito_intenso: 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    switch (goal) {
      case 'emagrecer':
        return Math.round(tdee * 0.8); // Déficit de 20%
      case 'definir':
        return Math.round(tdee * 0.85); // Déficit de 15%
      case 'manter':
        return Math.round(tdee);
      case 'ganhar_massa':
        return Math.round(tdee * 1.1); // Superávit de 10%
      default:
        return Math.round(tdee);
    }
  }

  // Calcular macronutrientes baseado no objetivo
  static calculateMacros(calories, goal) {
    let proteinRatio, carbRatio, fatRatio;

    switch (goal) {
      case 'emagrecer':
      case 'definir':
        proteinRatio = 0.35; // 35% proteína
        carbRatio = 0.30;    // 30% carboidratos
        fatRatio = 0.35;     // 35% gordura
        break;
      case 'ganhar_massa':
        proteinRatio = 0.25; // 25% proteína
        carbRatio = 0.50;    // 50% carboidratos
        fatRatio = 0.25;     // 25% gordura
        break;
      case 'manter':
      default:
        proteinRatio = 0.30; // 30% proteína
        carbRatio = 0.40;    // 40% carboidratos
        fatRatio = 0.30;     // 30% gordura
        break;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4),
      carbs: Math.round((calories * carbRatio) / 4),
      fat: Math.round((calories * fatRatio) / 9)
    };
  }

  // Calcular progresso do dia
  static calculateDayProgress(consumedFoods, targets) {
    const consumed = consumedFoods.reduce((total, food) => ({
      calories: total.calories + food.nutrients.calories,
      protein: total.protein + food.nutrients.protein,
      carbs: total.carbs + food.nutrients.carbs,
      fat: total.fat + food.nutrients.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      calories: {
        consumed: Math.round(consumed.calories),
        target: targets.calories,
        remaining: targets.calories - Math.round(consumed.calories),
        percentage: Math.round((consumed.calories / targets.calories) * 100)
      },
      protein: {
        consumed: Math.round(consumed.protein * 10) / 10,
        target: targets.protein,
        remaining: Math.round((targets.protein - consumed.protein) * 10) / 10,
        percentage: Math.round((consumed.protein / targets.protein) * 100)
      },
      carbs: {
        consumed: Math.round(consumed.carbs * 10) / 10,
        target: targets.carbs,
        remaining: Math.round((targets.carbs - consumed.carbs) * 10) / 10,
        percentage: Math.round((consumed.carbs / targets.carbs) * 100)
      },
      fat: {
        consumed: Math.round(consumed.fat * 10) / 10,
        target: targets.fat,
        remaining: Math.round((targets.fat - consumed.fat) * 10) / 10,
        percentage: Math.round((consumed.fat / targets.fat) * 100)
      }
    };
  }

  // Determinar status do dia
  static getDayStatus(progress) {
    const caloriePercentage = progress.calories.percentage;
    
    if (caloriePercentage >= 80 && caloriePercentage <= 120) {
      return {
        status: 'dentro_da_meta',
        color: '#28a745',
        icon: 'checkmark-circle',
        message: 'Dentro da meta!'
      };
    } else if (caloriePercentage < 50) {
      return {
        status: 'muito_baixo',
        color: '#dc3545',
        icon: 'alert-circle',
        message: 'Muito abaixo da meta'
      };
    } else if (caloriePercentage < 80) {
      return {
        status: 'abaixo_da_meta',
        color: '#ffc107',
        icon: 'warning',
        message: 'Abaixo da meta'
      };
    } else if (caloriePercentage > 150) {
      return {
        status: 'muito_alto',
        color: '#dc3545',
        icon: 'alert-circle',
        message: 'Muito acima da meta'
      };
    } else {
      return {
        status: 'acima_da_meta',
        color: '#fd7e14',
        icon: 'warning',
        message: 'Acima da meta'
      };
    }
  }
}

export default DietCalculator;