import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Diet from '../../pages/Diet';

const Stack = createNativeStackNavigator();

export default function DietStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
            name="Diet"
            component={Diet}
            options={{
                title: 'Dieta',
            }}
            />
        </Stack.Navigator>
    );
}