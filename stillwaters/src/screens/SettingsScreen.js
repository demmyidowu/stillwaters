import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, ListItem, Switch, Icon, Button, useTheme } from '@rneui/themed';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useUserStore from '../store/useUserStore';

/**
 * Settings Screen
 * 
 * Displays user profile information and application settings.
 * Allows users to toggle preferences (notifications, dark mode) and sign out.
 */
const SettingsScreen = ({ navigation }) => {
    const { user, settings, toggleNotifications, toggleDarkMode, signOut } = useUserStore();
    const { theme, updateTheme } = useTheme();

    /**
     * Handle user sign out with confirmation.
     */
    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                    }
                }
            ]
        );
    };

    const handleToggleDarkMode = () => {
        toggleDarkMode();
        updateTheme((theme) => ({
            mode: theme.mode === 'light' ? 'dark' : 'light',
        }));
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Profile Section */}
            <View style={[styles.profileSection, { backgroundColor: theme.colors.white }]}>
                <View style={styles.avatarContainer}>
                    <Icon name="person" type="ionicon" size={40} color={colors.white} />
                </View>
                <Text h4 style={[styles.name, { color: theme.colors.black }]}>
                    {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Friend'}
                </Text>
                <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Child of God</Text>
                </View>
            </View>

            {/* Preferences Section */}
            <View style={[styles.section, { backgroundColor: theme.colors.white, borderColor: theme.colors.grey0 }]}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <ListItem bottomDivider containerStyle={{ backgroundColor: theme.colors.white }}>
                    <Icon name="notifications-outline" type="ionicon" color={colors.primary.blue} />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: theme.colors.black }}>Notifications</ListItem.Title>
                    </ListItem.Content>
                    <Switch
                        value={settings.notifications}
                        onValueChange={toggleNotifications}
                        trackColor={{ true: colors.primary.blue }}
                    />
                </ListItem>

                <ListItem bottomDivider containerStyle={{ backgroundColor: theme.colors.white }} onPress={() => { }}>
                    <Icon name="book-outline" type="ionicon" color={colors.primary.blue} />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: theme.colors.black }}>Bible Translation</ListItem.Title>
                        <ListItem.Subtitle>{settings.translation}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>

            {/* Support Section */}
            <View style={[styles.section, { backgroundColor: theme.colors.white, borderColor: theme.colors.grey0 }]}>
                <Text style={styles.sectionTitle}>Support</Text>

                <ListItem bottomDivider containerStyle={{ backgroundColor: theme.colors.white }} onPress={() => Alert.alert('Help Center', 'Coming soon!')}>
                    <Icon name="help-circle-outline" type="ionicon" color={colors.secondary.medium} />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: theme.colors.black }}>Help Center</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>

                <ListItem bottomDivider containerStyle={{ backgroundColor: theme.colors.white }} onPress={() => Alert.alert('Privacy Policy', 'Your privacy is important to us.')}>
                    <Icon name="shield-checkmark-outline" type="ionicon" color={colors.secondary.medium} />
                    <ListItem.Content>
                        <ListItem.Title style={{ color: theme.colors.black }}>Privacy Policy</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>

            {/* Sign Out Button */}
            <Button
                title="Sign Out"
                type="clear"
                titleStyle={{ color: colors.semantic.error }}
                onPress={handleSignOut}
                containerStyle={styles.signOutContainer}
            />

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        padding: spacing.xl,
        marginBottom: spacing.m,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary.light,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    name: {
        marginBottom: 4,
    },
    email: {
        color: colors.secondary.medium,
        marginBottom: spacing.m,
    },
    badge: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.m,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: colors.white,
        fontWeight: typography.weights.bold,
        fontSize: typography.sizes.small,
    },
    section: {
        marginBottom: spacing.m,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        padding: spacing.m,
        paddingBottom: spacing.s,
        color: colors.secondary.medium,
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
    },
    signOutContainer: {
        marginVertical: spacing.l,
    },
    version: {
        textAlign: 'center',
        color: colors.secondary.medium,
        fontSize: typography.sizes.small,
        marginBottom: spacing.xl,
    },
});

export default SettingsScreen;
