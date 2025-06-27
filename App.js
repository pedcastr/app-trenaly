import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import Routes from './src/routes';
import SplashAnimation from './src/animation/index';

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);
  const navigationRef = useNavigationContainerRef();

  // Efeito para controlar a animação de splash
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setSplashFinished(true);
      }, 3000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Erro no efeito de splash:', error);
    }
  }, []);

  // Mostrar a animação de splash
  if (!splashFinished) {
    return <SplashAnimation />;
  }

  return (
    <AuthProvider>
      <UserProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#276999' }}>
          <StatusBar barStyle='light-content' backgroundColor="#276999" />
          <NavigationContainer ref={navigationRef}>
            <Routes />
          </NavigationContainer>
        </SafeAreaView>
      </UserProvider>
    </AuthProvider>
  );
}
