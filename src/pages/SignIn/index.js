import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { FeedbackModal } from '../../components/FeedbackModal';
import CustomTextInput from '../../components/CustomTextInput';
import LottieAnimation from "../../components/LottieAnimation";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', title: '', message: '' });

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  const handleLogin = async () => {
    dismissKeyboard();
    if (!email || !password) {
      setFeedback({
        type: 'error',
        title: 'Erro ao fazer login',
        message: 'Por favor, preencha todos os campos'
      });
      setFeedbackVisible(true);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
      let errorMessage = 'Erro ao fazer login';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas';
          break;
        default:
          errorMessage = 'Erro ao fazer login';
      }

      setFeedback({
        type: 'error',
        title: errorMessage,
        message: 'Verifique suas credenciais e tente novamente.'
      });
      setFeedbackVisible(true);

    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    dismissKeyboard();
    if (!email) {
      setFeedback({
        type: 'error',
        title: 'Email não informado',
        message: 'Digite seu email primeiro para recuperar a senha'
      });
      setFeedbackVisible(true);
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback({
        type: 'sucess',
        title: 'Email enviado com sucesso',
        message: 'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha'
      });
      setFeedbackVisible(true);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setFeedback({
        type: 'Erro',
        title: 'Erro ao enviar email',
        message: 'Verifique se o email está correto e tente novamente.'
      });
      setFeedbackVisible(true);
    } finally {
      setResetLoading(false);
    }
  };

  const handleContainerPress = () => {
    if (Platform.OS !== 'web') {
      dismissKeyboard();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -100}
    >
      <LinearGradient
        colors={['#ffffff', '#f0f8ff', '#e6f3ff', '#276999']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Pressable style={styles.pressableContainer} onPress={handleContainerPress}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#276999', '#1e5a7a']}
                  style={styles.logoCircle}
                >
                  <LottieAnimation
                    source={require("../../assets/animacaoLogin.json")}
                    autoPlay
                    loop={true}
                    speed={1.5}
                  />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Trenaly</Text>
              <Text style={styles.subtitle}>Seu parceiro fitness</Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              <View style={styles.card}>
                <Text style={styles.loginText}>Faça login para entrar</Text>

                {/* Email Input */}
                <CustomTextInput
                  placeholder="Digite seu email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="mail-outline"
                  containerStyle={styles.inputContainer}
                />

                {/* Password Input */}
                <CustomTextInput
                  placeholder="Digite sua senha"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="lock-closed-outline"
                  showPasswordToggle={true}
                  containerStyle={styles.inputContainer}
                />

                {/* Forgot Password */}
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  style={styles.forgotPasswordContainer}
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <ActivityIndicator size="small" color="#276999" />
                  ) : (
                    <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                  )}
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.loginButton}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#276999', '#1e5a7a']}
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Text style={styles.loginButtonText}>Entrar</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Register Button */}
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Cadastro')}>
                  <Text style={styles.registerButtonText}>Criar nova conta</Text>
                  <Ionicons name="person-add-outline" size={20} color="#276999" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Ao continuar, você concorda com nossos{'\n'}
                <Text style={styles.linkText}>Termos de Uso</Text> e{' '}
                <Text style={styles.linkText}>Política de Privacidade</Text>
              </Text>
            </View>
          </ScrollView>
        </Pressable>

        {feedbackVisible && (
          <View style={styles.modalOverlay}>
            <FeedbackModal
              visible={feedbackVisible}
              {...feedback}
              onClose={() => setFeedbackVisible(false)}
            />
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#276999'
  },
  gradient: {
    flex: 1,
  },
  pressableContainer: {
    flex: 1,
    cursor: Platform.OS === 'web' ? 'default' : 'auto',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 115,
    height: 110,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#276999',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(39, 105, 153, 0.3)',
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#276999',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '300',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  loginText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15, // O CustomTextInput já tem marginBottom: 20
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#276999',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#276999',
    borderRadius: 12,
    backgroundColor: 'transparent',
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
  },
  registerButtonText: {
    color: '#276999',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

