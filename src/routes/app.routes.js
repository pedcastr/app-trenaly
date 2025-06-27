import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

import HomeStack from './stacks/HomeStack';
import DietStack from './stacks/DietStack';
import TrainingStack from './stacks/TrainingStack';
import GymStack from './stacks/GymStack';
import ProfileStack from './stacks/ProfileStack';

const Tab = createBottomTabNavigator();

export default function AppRoutes() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#e9ecef',
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 5,
                    backgroundColor: '#ffffff',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                },
                tabBarActiveTintColor: '#276999',
                tabBarInactiveTintColor: '#8e8e93',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconSize = focused ? 28 : 24;

                    if (route.name === 'HomeStack') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'DietStack') {
                        iconName = focused ? 'nutrition' : 'nutrition-outline';
                    } else if (route.name === 'TrainingStack') {
                        iconName = focused ? 'barbell' : 'barbell-outline';
                    } else if (route.name === 'GymStack') {
                        iconName = focused ? 'location' : 'location-outline';
                    } else if (route.name === 'ProfileStack') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={iconSize} color={color} />;
                },
                tabBarLabel: ({ focused, color }) => {
                    let label;
                    
                    if (route.name === 'HomeStack') {
                        label = 'Início';
                    } else if (route.name === 'DietStack') {
                        label = 'Dieta';
                    } else if (route.name === 'TrainingStack') {
                        label = 'Treinos';
                    } else if (route.name === 'GymStack') {
                        label = 'Academias';
                    } else if (route.name === 'ProfileStack') {
                        label = 'Perfil';
                    }

                    return (
                        <Text style={{
                            color: color,
                            fontSize: focused ? 12 : 10,
                            fontWeight: focused ? '600' : '400',
                            marginTop: 2
                        }}>
                            {label}
                        </Text>
                    );
                },
            })}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
            />
            <Tab.Screen
                name="DietStack"
                component={DietStack}
            />
            <Tab.Screen
                name="TrainingStack"
                component={TrainingStack}
            />
            <Tab.Screen
                name="GymStack"
                component={GymStack}
            />
            <Tab.Screen
                name="ProfileStack"
                component={ProfileStack}
            />
        </Tab.Navigator>
    );
}
