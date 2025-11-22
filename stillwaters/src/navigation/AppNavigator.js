import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../utils/theme';
import useUserStore from '../store/useUserStore';

import HomeScreen from '../screens/HomeScreen';
import FAQScreen from '../screens/FAQScreen';
import FAQDetailScreen from '../screens/FAQDetailScreen';
import DevotionalScreen from '../screens/DevotionalScreen';
import JournalScreen from '../screens/JournalScreen';
import JournalEntryScreen from '../screens/JournalEntryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// --- Navigators ---
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const FAQStack = createNativeStackNavigator();
const JournalStack = createNativeStackNavigator();

/**
 * Auth Navigator
 * 
 * Handles the authentication flow (Login, Register).
 * Shown when the user is NOT authenticated.
 */
const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
};

/**
 * FAQ Navigator
 * 
 * Stack navigator for the FAQ section ("The Well").
 * Allows navigation from the list of questions to the detail view.
 */
const FAQNavigator = () => {
    return (
        <FAQStack.Navigator screenOptions={{
            headerStyle: { backgroundColor: colors.primary.blue },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: typography.weights.bold },
        }}>
            <FAQStack.Screen name="FAQList" component={FAQScreen} options={{ headerShown: false }} />
            <FAQStack.Screen name="FAQDetail" component={FAQDetailScreen} options={{ title: 'Answer' }} />
        </FAQStack.Navigator>
    );
};

/**
 * Journal Navigator
 * 
 * Stack navigator for the Journal section ("Reflection Pool").
 * Allows navigation from the list of entries to creating/editing an entry.
 */
const JournalNavigator = () => {
    return (
        <JournalStack.Navigator screenOptions={{
            headerStyle: { backgroundColor: colors.primary.blue },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: typography.weights.bold },
        }}>
            <JournalStack.Screen name="JournalList" component={JournalScreen} options={{ title: 'Reflection Pool' }} />
            <JournalStack.Screen name="JournalEntry" component={JournalEntryScreen} options={{ title: 'New Reflection' }} />
        </JournalStack.Navigator>
    );
};

/**
 * Main Tab Navigator
 * 
 * The main navigation structure for authenticated users.
 * Provides access to the 5 core features of the app.
 */
const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'The Guide') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'The Well') {
                        iconName = focused ? 'help-circle' : 'help-circle-outline';
                    } else if (route.name === 'Daily Streams') {
                        iconName = focused ? 'water' : 'water-outline';
                    } else if (route.name === 'Reflection Pool') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary.blue,
                tabBarInactiveTintColor: colors.secondary.medium,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.secondary.light,
                },
                headerStyle: {
                    backgroundColor: colors.primary.blue,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: typography.weights.bold,
                },
            })}
        >
            <Tab.Screen name="The Guide" component={HomeScreen} />
            <Tab.Screen name="The Well" component={FAQNavigator} />
            <Tab.Screen name="Daily Streams" component={DevotionalScreen} />
            <Tab.Screen name="Reflection Pool" component={JournalNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

/**
 * Root App Navigator
 * 
 * Orchestrates the top-level navigation logic.
 * Conditionally renders the AuthNavigator or TabNavigator based on the user's session state.
 */
const AppNavigator = () => {
    const { session, restoreSession } = useUserStore();

    // Check for an active session on app mount
    useEffect(() => {
        restoreSession();
    }, []);

    return (
        <NavigationContainer>
            {session ? <TabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
