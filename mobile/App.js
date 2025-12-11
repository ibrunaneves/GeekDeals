import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

function Routes() {
    const { signed, loading } = useContext(AuthContext);
    const [showSplash, setShowSplash] = useState(true);

    // Exibe a splash screen animada primeiro
    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    // Durante o carregamento do estado de autenticação
    if (loading) {
        return <SplashScreen onFinish={() => { }} />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {signed ? (
                <Stack.Screen name="Home" component={HomeScreen} />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </NavigationContainer>
    );
}
