import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import EventListScreen from '../screens/Events/EventListScreen';
import FavoriteListScreen from '../screens/Events/FavoriteListScreen';
import LogoutScreen from '../screens/Auth/LogoutScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import AddEditEventScreen from '../screens/Events/AddEditEventScreen'; // Import the AddEditEvent screen
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Favorites') {
                        iconName = 'heart-outline';
                    } else if (route.name === 'Logout') {
                        iconName = 'log-out-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={EventListScreen} />
            <Tab.Screen name="Favorites" component={FavoriteListScreen} />
            <Tab.Screen name="Logout" component={LogoutScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Auth Screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                
                {/* Main App Screens */}
                <Stack.Screen name="Main" component={MainTabs} />

                {/* AddEditEvent Screen (not in the bottom tab, only in the stack) */}
                <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}