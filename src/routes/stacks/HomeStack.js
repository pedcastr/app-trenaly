import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../../pages/Home';
import CreatePost from '../../pages/CreatePost';
import CreateStory from '../../pages/CreateStory';
import Search from '../../pages/Search';
import Comments from '../../pages/Comments';
import ViewStory from '../../pages/ViewStory';
import Chat from '../../pages/Chat';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: 'Início',
                }}
            />
            <Stack.Screen
                name="CreatePost"
                component={CreatePost}
                options={{
                    title: 'Criar Postagem',
                }}
            />
            <Stack.Screen
                name="CreateStory"
                component={CreateStory}
                options={{
                    title: 'Criar Story',
                }}
            />
            <Stack.Screen
                name="Search"
                component={Search}
                options={{
                    title: 'Pesquisar',
                }}
            />
            <Stack.Screen
                name="Comments"
                component={Comments}
                options={{
                    title: 'Comentários',
                }}
            />
            <Stack.Screen
                name="ViewStory"
                component={ViewStory}
                options={{
                    title: 'Story',
                    presentation: 'fullScreenModal',
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    title: 'Chat',
                }}
            />
        </Stack.Navigator>
    );
}
