import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { styles } from './styles';

export default function Settings({ navigation }) {
  const { user, userData } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível sair da conta');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.');
          }
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, danger = false }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
          <Ionicons name={icon} size={20} color={danger ? '#ff3040' : '#276999'} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#276999', '#1e5a7a']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.headerButton} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seção da Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <SettingItem
            icon="person-outline"
            title="Editar Perfil"
            subtitle="Nome, bio e foto"
            onPress={() => navigation.navigate('EditProfile')}
          />
          
          <SettingItem
            icon="lock-closed-outline"
            title="Privacidade"
            subtitle="Controle quem pode ver seu conteúdo"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
          
          <SettingItem
            icon="notifications-outline"
            title="Notificações"
            subtitle="Push, email e SMS"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
        </View>

        {/* Seção de Conteúdo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conteúdo</Text>
          
          <SettingItem
            icon="bookmark-outline"
            title="Salvos"
            subtitle="Posts e stories salvos"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
          
          <SettingItem
            icon="time-outline"
            title="Arquivo"
            subtitle="Posts e stories arquivados"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
          
          <SettingItem
            icon="download-outline"
            title="Baixar dados"
            subtitle="Faça download dos seus dados"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
        </View>

        {/* Seção de Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          <SettingItem
            icon="help-circle-outline"
            title="Central de Ajuda"
            subtitle="Dúvidas e suporte"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
          
          <SettingItem
            icon="flag-outline"
            title="Reportar problema"
            subtitle="Relate bugs ou problemas"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
          
          <SettingItem
            icon="document-text-outline"
            title="Termos e Políticas"
            subtitle="Termos de uso e privacidade"
            onPress={() => Alert.alert('Em desenvolvimento', 'Esta funcionalidade será implementada em breve.')}
          />
        </View>

        {/* Seção de Conta (Ações perigosas) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <SettingItem
            icon="log-out-outline"
            title="Sair"
            subtitle="Fazer logout da conta"
            onPress={handleLogout}
            danger={true}
          />
          
          <SettingItem
            icon="trash-outline"
            title="Excluir conta"
            subtitle="Remover permanentemente sua conta"
            onPress={handleDeleteAccount}
            danger={true}
          />
        </View>

        {/* Informações do app */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Trenaly v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 Trenaly. Todos os direitos reservados.</Text>
        </View>
      </ScrollView>
    </View>
  );
}