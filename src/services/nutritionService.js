import Constants from 'expo-constants';

class NutritionService {
  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.usdaApiKey ||
      Constants.manifest?.extra?.usdaApiKey ||
      process.env.EXPO_PUBLIC_USDA_API_KEY;
    this.baseUrl = 'https://api.nal.usda.gov/fdc/v1';
  }

  // Buscar alimentos por nome
  async searchFoods(query, pageSize = 25) {
    try {
      // Primeiro tenta buscar nos dados brasileiros
      const brazilianResults = this.searchBrazilianFoods(query);

      if (brazilianResults.length > 0) {
        return brazilianResults;
      }

      // Se não encontrar, tenta na API USDA
      if (this.apiKey && this.apiKey !== 'undefined') {
        const response = await fetch(
          `${this.baseUrl}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${this.apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          const translatedFoods = data.foods?.map(food => ({
            id: food.fdcId.toString(),
            name: this.translateFoodName(food.description),
            brand: food.brandOwner || food.brandName || '',
            category: this.translateCategory(food.foodCategory || 'Alimento'),
            nutrients: this.extractNutrients(food.foodNutrients || [])
          })) || [];

          return [...brazilianResults, ...translatedFoods].slice(0, pageSize);
        }
      }

      // Fallback para dados mock brasileiros
      return this.searchBrazilianFoods(query);

    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
      return this.searchBrazilianFoods(query);
    }
  }

  // Base de dados brasileira expandida
  searchBrazilianFoods(query) {
    const brazilianFoods = [
      // Cereais e Grãos
      {
        id: 'br_001',
        name: 'Arroz branco cozido',
        brand: '',
        category: 'Cereais',
        nutrients: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, calcium: 10, iron: 0.8, vitaminC: 0 }
      },
      {
        id: 'br_002',
        name: 'Arroz integral cozido',
        brand: '',
        category: 'Cereais',
        nutrients: { calories: 112, protein: 2.6, carbs: 22, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 1, calcium: 10, iron: 0.4, vitaminC: 0 }
      },
      {
        id: 'br_003',
        name: 'Feijão preto cozido',
        brand: '',
        category: 'Leguminosas',
        nutrients: { calories: 132, protein: 8.9, carbs: 23, fat: 0.5, fiber: 8.7, sugar: 0.3, sodium: 2, calcium: 27, iron: 2.1, vitaminC: 0 }
      },
      {
        id: 'br_004',
        name: 'Feijão carioca cozido',
        brand: '',
        category: 'Leguminosas',
        nutrients: { calories: 127, protein: 8.7, carbs: 22, fat: 0.5, fiber: 6.2, sugar: 0.3, sodium: 2, calcium: 40, iron: 1.8, vitaminC: 0 }
      },
      {
        id: 'br_005',
        name: 'Aveia em flocos',
        brand: '',
        category: 'Cereais',
        nutrients: { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sugar: 1, sodium: 2, calcium: 54, iron: 5, vitaminC: 0 }
      },
      {
        id: 'br_006',
        name: 'Quinoa cozida',
        brand: '',
        category: 'Cereais',
        nutrients: { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7, calcium: 17, iron: 1.5, vitaminC: 0 }
      },
      {
        id: 'br_007',
        name: 'Macarrão integral cozido',
        brand: '',
        category: 'Cereais',
        nutrients: { calories: 124, protein: 5, carbs: 25, fat: 1.1, fiber: 3.2, sugar: 1.2, sodium: 3, calcium: 15, iron: 1.3, vitaminC: 0 }
      },

      // Carnes e Proteínas
      {
        id: 'br_008',
        name: 'Peito de frango grelhado',
        brand: '',
        category: 'Carnes',
        nutrients: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, calcium: 15, iron: 1, vitaminC: 0 }
      },
      {
        id: 'br_009',
        name: 'Carne bovina magra grelhada',
        brand: '',
        category: 'Carnes',
        nutrients: { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 60, calcium: 18, iron: 2.6, vitaminC: 0 }
      },
      {
        id: 'br_010',
        name: 'Peixe tilápia grelhada',
        brand: '',
        category: 'Peixes',
        nutrients: { calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, sugar: 0, sodium: 52, calcium: 14, iron: 0.7, vitaminC: 0 }
      },
      {
        id: 'br_011',
        name: 'Salmão grelhado',
        brand: '',
        category: 'Peixes',
        nutrients: { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59, calcium: 9, iron: 0.3, vitaminC: 0 }
      },
      {
        id: 'br_012',
        name: 'Ovo cozido',
        brand: '',
        category: 'Ovos',
        nutrients: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, calcium: 50, iron: 1.2, vitaminC: 0 }
      },
      {
        id: 'br_013',
        name: 'Ovo mexido',
        brand: '',
        category: 'Ovos',
        nutrients: { calories: 148, protein: 10, carbs: 1.2, fat: 11, fiber: 0, sugar: 1.2, sodium: 342, calcium: 43, iron: 1.2, vitaminC: 0 }
      },

      // Frutas
      {
        id: 'br_014',
        name: 'Banana',
        brand: '',
        category: 'Frutas',
        nutrients: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, calcium: 5, iron: 0.3, vitaminC: 8.7 }
      },
      {
        id: 'br_015',
        name: 'Maçã',
        brand: '',
        category: 'Frutas',
        nutrients: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, calcium: 6, iron: 0.1, vitaminC: 4.6 }
      },
      {
        id: 'br_016',
        name: 'Laranja',
        brand: '',
        category: 'Frutas',
        nutrients: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9.4, sodium: 0, calcium: 40, iron: 0.1, vitaminC: 53.2 }
      },
      {
        id: 'br_017',
        name: 'Mamão',
        brand: '',
        category: 'Frutas',
        nutrients: { calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, sugar: 7.8, sodium: 8, calcium: 20, iron: 0.3, vitaminC: 60.9 }
      },
      {
        id: 'br_018',
        name: 'Abacate',
        brand: '',
        category: 'Frutas',
        nutrients: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7, sodium: 7, calcium: 12, iron: 0.6, vitaminC: 10 }
      },
      {
        id: 'br_019',
        name: 'Manga',
        brand: '',
        category: 'Frutas',
        nutrients: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 13.7, sodium: 1, calcium: 11, iron: 0.2, vitaminC: 36.4 }
      },

      // Vegetais
      {
        id: 'br_020',
        name: 'Brócolis cozido',
        brand: '',
        category: 'Vegetais',
        nutrients: { calories: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3, sugar: 1.9, sodium: 41, calcium: 40, iron: 0.9, vitaminC: 65 }
      },
      {
        id: 'br_021',
        name: 'Couve refogada',
        brand: '',
        category: 'Vegetais',
        nutrients: { calories: 36, protein: 3.3, carbs: 6, fat: 0.7, fiber: 3.6, sugar: 2.3, sodium: 38, calcium: 150, iron: 1.1, vitaminC: 93 }
      },
      {
        id: 'br_022',
        name: 'Cenoura cozida',
        brand: '',
        category: 'Vegetais',
        nutrients: { calories: 35, protein: 0.8, carbs: 8, fat: 0.2, fiber: 2.8, sugar: 3.4, sodium: 58, calcium: 30, iron: 0.3, vitaminC: 3.6 }
      },
      {
        id: 'br_023',
        name: 'Abobrinha refogada',
        brand: '',
        category: 'Vegetais',
        nutrients: { calories: 20, protein: 1.2, carbs: 4, fat: 0.3, fiber: 1.1, sugar: 2.5, sodium: 8, calcium: 16, iron: 0.4, vitaminC: 17.9 }
      },
      {
        id: 'br_024',
        name: 'Tomate',
        brand: '',
        category: 'Vegetais',
        nutrients: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5, calcium: 10, iron: 0.3, vitaminC: 13.7 }
      },

      // Laticínios
      {
        id: 'br_025',
        name: 'Leite desnatado',
        brand: '',
        category: 'Laticínios',
        nutrients: { calories: 34, protein: 3.4, carbs: 5, fat: 0.2, fiber: 0, sugar: 5, sodium: 52, calcium: 125, iron: 0.1, vitaminC: 1 }
      },
      {
        id: 'br_026',
        name: 'Iogurte natural',
        brand: '',
        category: 'Laticínios',
        nutrients: { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, sugar: 4.7, sodium: 46, calcium: 121, iron: 0.1, vitaminC: 0.5 }
      },
      {
        id: 'br_027',
        name: 'Queijo minas frescal',
        brand: '',
        category: 'Laticínios',
        nutrients: {
          calories: 264, protein: 17.4, carbs: 3, fat: 20.2,
          fiber: 0, sugar: 3, sodium: 346, calcium: 579, iron: 0.4, vitaminC: 0
        }
      },
      {
        id: 'br_028',
        name: 'Requeijão light',
        brand: '',
        category: 'Laticínios',
        nutrients: { calories: 54, protein: 8.8, carbs: 3.8, fat: 0.6, fiber: 0, sugar: 3.8, sodium: 330, calcium: 84, iron: 0.1, vitaminC: 0 }
      },

      // Oleaginosas e Sementes
      {
        id: 'br_029',
        name: 'Amendoim torrado',
        brand: '',
        category: 'Oleaginosas',
        nutrients: { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, sugar: 4.7, sodium: 18, calcium: 92, iron: 4.6, vitaminC: 0 }
      },
      {
        id: 'br_030',
        name: 'Castanha do Pará',
        brand: '',
        category: 'Oleaginosas',
        nutrients: { calories: 656, protein: 14, carbs: 12, fat: 66, fiber: 7.5, sugar: 2.3, sodium: 3, calcium: 160, iron: 2.4, vitaminC: 0.7 }
      },
      {
        id: 'br_031',
        name: 'Amêndoas',
        brand: '',
        category: 'Oleaginosas',
        nutrients: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4.4, sodium: 1, calcium: 269, iron: 3.7, vitaminC: 0 }
      },

      // Tubérculos
      {
        id: 'br_032',
        name: 'Batata doce cozida',
        brand: '',
        category: 'Tubérculos',
        nutrients: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 5, calcium: 30, iron: 0.6, vitaminC: 2.4 }
      },
      {
        id: 'br_033',
        name: 'Batata inglesa cozida',
        brand: '',
        category: 'Tubérculos',
        nutrients: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, calcium: 12, iron: 0.8, vitaminC: 19.7 }
      },
      {
        id: 'br_034',
        name: 'Mandioca cozida',
        brand: '',
        category: 'Tubérculos',
        nutrients: { calories: 160, protein: 1.4, carbs: 38, fat: 0.3, fiber: 1.8, sugar: 1.7, sodium: 14, calcium: 16, iron: 0.3, vitaminC: 20.6 }
      },

      // Bebidas
      {
        id: 'br_035',
        name: 'Água de coco',
        brand: '',
        category: 'Bebidas',
        nutrients: { calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, sugar: 2.6, sodium: 105, calcium: 24, iron: 0.3, vitaminC: 2.4 }
      },
      {
        id: 'br_036',
        name: 'Suco de laranja natural',
        brand: '',
        category: 'Bebidas',
        nutrients: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, fiber: 0.2, sugar: 8.1, sodium: 1, calcium: 11, iron: 0.2, vitaminC: 50 }
      },

      // Pães e Massas
      {
        id: 'br_037',
        name: 'Pão integral',
        brand: '',
        category: 'Pães',
        nutrients: { calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 6, sugar: 6, sodium: 681, calcium: 73, iron: 3.6, vitaminC: 0 }
      },
      {
        id: 'br_038',
        name: 'Pão francês',
        brand: '',
        category: 'Pães',
        nutrients: { calories: 265, protein: 8.4, carbs: 58, fat: 1.6, fiber: 2.3, sugar: 5, sodium: 643, calcium: 40, iron: 1.4, vitaminC: 0 }
      },
      {
        id: 'br_039',
        name: 'Tapioca',
        brand: '',
        category: 'Pães',
        nutrients: { calories: 358, protein: 1.2, carbs: 88, fat: 0.2, fiber: 1.4, sugar: 3.4, sodium: 1, calcium: 20, iron: 1.6, vitaminC: 0 }
      },

      // Temperos e Condimentos
      {
        id: 'br_040',
        name: 'Azeite de oliva',
        brand: '',
        category: 'Óleos',
        nutrients: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2, calcium: 1, iron: 0.6, vitaminC: 0 }
      }
    ];

    const searchTerm = query.toLowerCase();
    return brazilianFoods.filter(food =>
      food.name.toLowerCase().includes(searchTerm) ||
      food.category.toLowerCase().includes(searchTerm)
    ).slice(0, 15);
  }

  // Traduzir nomes de alimentos da API USDA
  translateFoodName(englishName) {
    const translations = {
      'rice': 'arroz',
      'chicken': 'frango',
      'beef': 'carne bovina',
      'fish': 'peixe',
      'egg': 'ovo',
      'milk': 'leite',
      'cheese': 'queijo',
      'bread': 'pão',
      'apple': 'maçã',
      'banana': 'banana',
      'orange': 'laranja',
      'potato': 'batata',
      'tomato': 'tomate',
      'carrot': 'cenoura',
      'broccoli': 'brócolis',
      'beans': 'feijão',
      'oats': 'aveia'
    };

    let translatedName = englishName.toLowerCase();
    Object.keys(translations).forEach(english => {
      translatedName = translatedName.replace(new RegExp(english, 'gi'), translations[english]);
    });

    return translatedName.charAt(0).toUpperCase() + translatedName.slice(1);
  }

  // Traduzir categorias
  translateCategory(englishCategory) {
    const categoryTranslations = {
      'Dairy and Egg Products': 'Laticínios e Ovos',
      'Spices and Herbs': 'Temperos e Ervas',
      'Baby Foods': 'Alimentos Infantis',
      'Fats and Oils': 'Gorduras e Óleos',
      'Poultry Products': 'Aves',
      'Soups, Sauces, and Gravies': 'Sopas e Molhos',
      'Sausages and Luncheon Meats': 'Embutidos',
      'Breakfast Cereals': 'Cereais',
      'Fruits and Fruit Juices': 'Frutas',
      'Pork Products': 'Carne Suína',
      'Vegetables and Vegetable Products': 'Vegetais',
      'Nut and Seed Products': 'Oleaginosas',
      'Beef Products': 'Carne Bovina',
      'Beverages': 'Bebidas',
      'Finfish and Shellfish Products': 'Peixes e Frutos do Mar',
      'Legumes and Legume Products': 'Leguminosas',
      'Lamb, Veal, and Game Products': 'Carnes Especiais',
      'Baked Products': 'Produtos de Panificação',
      'Sweets': 'Doces',
      'Cereal Grains and Pasta': 'Cereais e Massas',
      'Fast Foods': 'Fast Food',
      'Meals, Entrees, and Side Dishes': 'Refeições Prontas',
      'Snacks': 'Lanches'
    };

    return categoryTranslations[englishCategory] || englishCategory;
  }

  // Extrair nutrientes principais
  extractNutrients(foodNutrients) {
    const nutrients = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0
    };

    foodNutrients.forEach(nutrient => {
      const value = nutrient.value || 0;

      switch (nutrient.nutrientId) {
        case 1008: // Energia (kcal)
          nutrients.calories = Math.round(value);
          break;
        case 1003: // Proteína
          nutrients.protein = Math.round(value * 10) / 10;
          break;
        case 1005: // Carboidratos
          nutrients.carbs = Math.round(value * 10) / 10;
          break;
        case 1004: // Gordura total
          nutrients.fat = Math.round(value * 10) / 10;
          break;
        case 1079: // Fibra
          nutrients.fiber = Math.round(value * 10) / 10;
          break;
        case 2000: // Açúcar total
          nutrients.sugar = Math.round(value * 10) / 10;
          break;
        case 1093: // Sódio
          nutrients.sodium = Math.round(value);
          break;
        case 1087: // Cálcio
          nutrients.calcium = Math.round(value);
          break;
        case 1089: // Ferro
          nutrients.iron = Math.round(value * 10) / 10;
          break;
        case 1162: // Vitamina C
          nutrients.vitaminC = Math.round(value * 10) / 10;
          break;
      }
    });

    return nutrients;
  }
}

export default new NutritionService();

