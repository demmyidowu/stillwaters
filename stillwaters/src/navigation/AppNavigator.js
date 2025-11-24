import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Icon } from '@rneui/themed';
import { typography } from '../utils/theme';
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
import ChatListScreen from '../screens/ChatListScreen';

// --- Navigators ---
const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const FAQStack = createStackNavigator();
const JournalStack = createStackNavigator();
const GuideStack = createStackNavigator();

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
    const { theme } = useTheme();
    return (
        <FAQStack.Navigator screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.white,
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
    const { theme } = useTheme();
    return (
        <JournalStack.Navigator screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.white,
            headerTitleStyle: { fontWeight: typography.weights.bold },
        }}>
            <JournalStack.Screen name="JournalList" component={JournalScreen} options={{ title: 'The Pond' }} />
            <JournalStack.Screen name="JournalEntry" component={JournalEntryScreen} options={{ title: 'New Reflection' }} />
        </JournalStack.Navigator>
    );
};

/**
 * Guide Navigator
 * 
 * Stack navigator for the Guide section ("The Guide").
 * Allows navigation from the chat list to a specific chat.
 */
const GuideNavigator = () => {
    const { theme } = useTheme();
    return (
        <GuideStack.Navigator screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitleVisible: false,
        }}>
            <GuideStack.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ title: 'The Guide', headerShown: false }}
            />
            <GuideStack.Screen
                name="Chat"
                component={HomeScreen}
                options={{ title: 'Conversation' }}
            />
        </GuideStack.Navigator>
    );
};

/**
 * Main Tab Navigator
 * 
 * The main navigation structure for authenticated users.
 * Provides access to the 5 core features of the app.
 */
const TabNavigator = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName="Daily Streams"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'The Guide') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'The Well') {
                        iconName = focused ? 'water' : 'water-outline';
                    } else if (route.name === 'Daily Streams') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'The Pond') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Icon name={iconName} type="ionicon" size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.grey2,
                tabBarStyle: {
                    backgroundColor: theme.colors.white,
                    borderTopColor: theme.colors.grey0,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="The Pond" component={JournalNavigator} />
            <Tab.Screen name="The Guide" component={GuideNavigator} />
            <Tab.Screen name="Daily Streams" component={DevotionalScreen} />
            <Tab.Screen name="The Well" component={FAQNavigator} />
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
