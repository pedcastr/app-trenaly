import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/SignIn';
import UserRegistrationForm from '../pages/SignUp';

const Stack = createNativeStackNavigator();

export default function SignUpRoutes() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen 
            name="SignIn" 
            component={SignIn} 
            options={{
                title: 'Login',
            }}
            />
            <Stack.Screen 
            name="Cadastro" 
            component={UserRegistrationForm}
            options={{
                headerShown: false,
                headerTitle: 'Criar Conta',
            }}
            />
        </Stack.Navigator>
    );
}