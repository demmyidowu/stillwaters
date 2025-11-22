import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useUserStore from '../store/useUserStore';

/**
 * Login Screen
 * 
 * Allows existing users to sign in to the application.
 * Uses Supabase Auth via the user store.
 */
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, isLoading } = useUserStore();

    /**
     * Handle login form submission.
     */
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        const { error } = await signIn(email, password);

        if (error) {
            Alert.alert('Login Failed', error.message);
        }
        // Navigation is handled by AppNavigator observing session state
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Logo / Header Section */}
            <View style={styles.logoContainer}>
                <Text h2 style={styles.title}>StillWaters</Text>
                <Text style={styles.subtitle}>He leads me beside quiet waters.</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
                <Input
                    placeholder="Email"
                    leftIcon={{ type: 'ionicon', name: 'mail-outline', color: colors.secondary.medium }}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    inputContainerStyle={styles.input}
                />

                <Input
                    placeholder="Password"
                    leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: colors.secondary.medium }}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    inputContainerStyle={styles.input}
                />

                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    loading={isLoading}
                    buttonStyle={styles.loginButton}
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                />

                <Button
                    title="Create an Account"
                    type="clear"
                    onPress={() => navigation.navigate('Register')}
                    titleStyle={styles.linkTitle}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary.blue,
        justifyContent: 'center',
        padding: spacing.l,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        color: colors.white,
        fontFamily: typography.serif,
        marginBottom: spacing.s,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: typography.sizes.body,
        fontStyle: 'italic',
    },
    formContainer: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.l,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    input: {
        borderBottomColor: colors.secondary.light,
    },
    loginButton: {
        backgroundColor: colors.primary.blue,
        borderRadius: 25,
        paddingVertical: spacing.m,
    },
    buttonContainer: {
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    buttonTitle: {
        fontWeight: typography.weights.bold,
    },
    linkTitle: {
        color: colors.secondary.medium,
    },
});

export default LoginScreen;
