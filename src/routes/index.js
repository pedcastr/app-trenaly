import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import SignUpRoutes from './signup.routes';
import AppRoutes from './app.routes';

export default function Routes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#276999' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (!user) {
    return <SignUpRoutes/>;
  } else {
    return <AppRoutes/>;
  }

}
