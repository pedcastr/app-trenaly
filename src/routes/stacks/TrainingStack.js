import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Treining from '../../pages/Training';

const Stack = createNativeStackNavigator();

export default function TrainingStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
            name="Treining"
            component={Treining}
            options={{
                title: 'Treino',
            }}
            />
        </Stack.Navigator>
    );
}