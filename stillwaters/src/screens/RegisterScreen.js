import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useUserStore from '../store/useUserStore';

/**
 * Register Screen
 * 
 * Allows new users to create an account.
 * Validates input and uses Supabase Auth for registration.
 */
const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { signUp, isLoading } = useUserStore();

    /**
     * Handle registration form submission.
     */
    const handleRegister = async () => {
        // Basic Validation
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        // Attempt to sign up
        const { error } = await signUp(email, password, fullName);

        if (error) {
            Alert.alert('Registration Failed', error.message);
        } else {
            Alert.alert('Success', 'Account created! Please check your email to verify your account.');
            navigation.navigate('Login');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text h3 style={styles.title}>Join StillWaters</Text>
                <Text style={styles.subtitle}>Begin your journey to deeper faith.</Text>
            </View>

            <View style={styles.formContainer}>
                <Input
                    placeholder="Full Name"
                    leftIcon={{ type: 'ionicon', name: 'person-outline', color: colors.secondary.medium }}
                    value={fullName}
                    onChangeText={setFullName}
                    inputContainerStyle={styles.input}
                />

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

                <Input
                    placeholder="Confirm Password"
                    leftIcon={{ type: 'ionicon', name: 'lock-closed-outline', color: colors.secondary.medium }}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    inputContainerStyle={styles.input}
                />

                <Button
                    title="Create Account"
                    onPress={handleRegister}
                    loading={isLoading}
                    buttonStyle={styles.registerButton}
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                />

                <Button
                    title="Already have an account? Sign In"
                    type="clear"
                    onPress={() => navigation.navigate('Login')}
                    titleStyle={styles.linkTitle}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.light,
        justifyContent: 'center',
        padding: spacing.l,
    },
    header: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    title: {
        color: colors.primary.dark,
        fontFamily: typography.serif,
        marginBottom: spacing.s,
    },
    subtitle: {
        color: colors.secondary.medium,
        fontSize: typography.sizes.body,
    },
    formContainer: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.l,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        borderBottomColor: colors.secondary.light,
    },
    registerButton: {
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

export default RegisterScreen;
