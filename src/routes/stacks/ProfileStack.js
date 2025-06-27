import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '../../pages/Profile';
import EditProfile from '../../pages/EditProfile';
import Settings from '../../pages/Settings';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: 'Perfil',
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    title: 'Editar Perfil',
                }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: 'Configurações',
                }}
            />
        </Stack.Navigator>
    );
}
