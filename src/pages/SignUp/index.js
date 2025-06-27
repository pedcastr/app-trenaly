import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { styles } from './styles';

export default function UserRegistrationForm({ onSubmit, navigation }) {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    idade: '',
    peso: '',
    altura: '',
    genero: 'masculino',
    nivelAtividade: 'moderado',
    objetivo: 'manter',
    senha: '',
    confirmarSenha: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.sobrenome.trim()) newErrors.sobrenome = 'Sobrenome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.idade) newErrors.idade = 'Idade é obrigatória';
    if (!formData.peso) newErrors.peso = 'Peso é obrigatório';
    if (!formData.altura) newErrors.altura = 'Altura é obrigatória';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de senha
    if (formData.senha && formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação de confirmação de senha
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    // Validação de idade
    const idade = parseInt(formData.idade);
    if (formData.idade && (idade < 8 || idade > 120)) {
      newErrors.idade = 'Idade deve estar entre 8 e 120 anos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.senha
      );

      const user = userCredential.user;
      const emailId = formData.email.toLowerCase().trim();

      // Preparar dados do usuário para o Firestore
      const userData = {
        nome: formData.nome.trim(),
        sobrenome: formData.sobrenome.trim(),
        email: emailId,
        idade: parseInt(formData.idade),
        peso: parseFloat(formData.peso.replace(',', '.')),
        altura: parseInt(formData.altura),
        genero: formData.genero,
        nivelAtividade: formData.nivelAtividade,
        objetivo: formData.objetivo,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        uid: user.uid // Manter o UID para referência
      };

      // Salvar dados do usuário no Firestore usando EMAIL como ID
      await setDoc(doc(db, 'users', emailId), userData);

      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSubmit) {
                onSubmit(userData);
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao criar conta:', error);

      let errorMessage = 'Erro ao criar conta. Tente novamente.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet.';
          break;
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatWeight = (text) => {
    // Remove tudo que não é número ou vírgula
    let cleaned = text.replace(/[^0-9,]/g, '');

    // Garante apenas uma vírgula
    const parts = cleaned.split(',');
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('');
    }

    return cleaned;
  };

  const formatHeight = (text) => {
    // Remove tudo que não é número
    return text.replace(/[^0-9]/g, '');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#276999" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Criando conta...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
    >
      <ScrollView style={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#276999" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email *"
            value={formData.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            style={[styles.input, errors.email && { borderColor: '#ff4444' }]}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nome *"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            style={[styles.input, errors.nome && { borderColor: '#ff4444' }]}
          />
          {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Sobrenome *"
            value={formData.sobrenome}
            onChangeText={(text) => setFormData({ ...formData, sobrenome: text })}
            style={[styles.input, errors.sobrenome && { borderColor: '#ff4444' }]}
          />
          {errors.sobrenome && <Text style={styles.errorText}>{errors.sobrenome}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Idade *"
            value={formData.idade}
            onChangeText={(text) => setFormData({ ...formData, idade: text.replace(/[^0-9]/g, '') })}
            keyboardType="numeric"
            maxLength={3}
            style={[styles.input, errors.idade && { borderColor: '#ff4444' }]}
          />
          {errors.idade && <Text style={styles.errorText}>{errors.idade}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Peso (kg) *"
            value={formData.peso ? `${formData.peso} kg` : ''}
            onChangeText={(text) => {
              const cleaned = formatWeight(text.replace(' kg', ''));
              setFormData({ ...formData, peso: cleaned });
            }}
            keyboardType="numeric"
            style={[styles.input, errors.peso && { borderColor: '#ff4444' }]}
          />
          {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Altura (cm) *"
            value={formData.altura ? `${formData.altura} cm` : ''}
            onChangeText={(text) => {
              const cleaned = formatHeight(text.replace(' cm', ''));
              setFormData({ ...formData, altura: cleaned });
            }}
            keyboardType="numeric"
            maxLength={6}
            style={[styles.input, errors.altura && { borderColor: '#ff4444' }]}
          />
          {errors.altura && <Text style={styles.errorText}>{errors.altura}</Text>}
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Gênero:</Text>
          <Picker
            selectedValue={formData.genero}
            onValueChange={(value) => setFormData({ ...formData, genero: value })}
            style={styles.picker}
          >
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Nível de Atividade:</Text>
          <Picker
            selectedValue={formData.nivelAtividade}
            onValueChange={(value) => setFormData({ ...formData, nivelAtividade: value })}
            style={styles.picker}
          >
            <Picker.Item label="Sedentário" value="sedentario" />
            <Picker.Item label="Levemente ativo" value="leve" />
            <Picker.Item label="Moderadamente ativo" value="moderado" />
            <Picker.Item label="Muito ativo" value="intenso" />
            <Picker.Item label="Extremamente ativo" value="muito_intenso" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Objetivo:</Text>
          <Picker
            selectedValue={formData.objetivo}
            onValueChange={(value) => setFormData({ ...formData, objetivo: value })}
            style={styles.picker}
          >
            <Picker.Item label="Emagrecer" value="emagrecer" />
            <Picker.Item label="Definir músculos" value="definir" />
            <Picker.Item label="Ganhar massa muscular" value="ganhar_massa" />
            <Picker.Item label="Manter peso atual" value="manter" />
          </Picker>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha *"
            value={formData.senha}
            onChangeText={(text) => setFormData({ ...formData, senha: text })}
            secureTextEntry={!showPassword}
            style={[styles.passwordInput, errors.senha && { borderColor: '#ff4444' }]}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirme a senha *"
            value={formData.confirmarSenha}
            onChangeText={(text) => setFormData({ ...formData, confirmarSenha: text })}
            secureTextEntry={!showConfirmPassword}
            style={[styles.passwordInput, errors.confirmarSenha && { borderColor: '#ff4444' }]}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Criar Conta
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

