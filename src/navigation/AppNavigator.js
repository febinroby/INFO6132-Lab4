import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import EventListScreen from '../screens/Events/EventListScreen';
import AddEditEventScreen from '../screens/Events/AddEditEventScreen';
import FavoriteListScreen from '../screens/Events/FavoriteListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="EventList" component={EventListScreen} />
                <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} />
                <Stack.Screen name="FavoriteList" component={FavoriteListScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}