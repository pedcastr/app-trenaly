import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Gym from '../../pages/Gym';

const Stack = createNativeStackNavigator();

export default function GymStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
            name="Gym"
            component={Gym}
            options={{
                title: 'Academias',
            }}
            />
        </Stack.Navigator>
    );
}