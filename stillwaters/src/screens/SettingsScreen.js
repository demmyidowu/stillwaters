import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, ListItem, Switch, Icon, Avatar, Button } from 'react-native-elements';
import { commonStyles, colors, spacing, typography } from '../utils/theme';
import useUserStore from '../store/useUserStore';

/**
 * Settings Screen
 * 
 * Displays user profile information and application settings.
 * Allows users to toggle preferences (notifications, dark mode) and sign out.
 */
const SettingsScreen = ({ navigation }) => {
    const { user, settings, toggleNotifications, toggleDarkMode, setTranslation, signOut } = useUserStore();

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
                        // Navigation to Auth stack is automatic via AppNavigator
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Avatar
                    rounded
                    size="large"
                    icon={{ name: 'person', type: 'ionicon' }}
                    containerStyle={styles.avatar}
                />
                <Text h4 style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{user?.tier || 'Free'} Plan</Text>
                </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <ListItem bottomDivider containerStyle={styles.listItem}>
                    <Icon name="notifications-outline" type="ionicon" color={colors.primary.blue} />
                    <ListItem.Content>
                        <ListItem.Title>Notifications</ListItem.Title>
                    </ListItem.Content>
                    <Switch
                        value={settings.notifications}
                        onValueChange={toggleNotifications}
                        trackColor={{ true: colors.primary.blue }}
                    />
                </ListItem>

                <ListItem bottomDivider containerStyle={styles.listItem}>
                    <Icon name="moon-outline" type="ionicon" color={colors.primary.blue} />
                    <ListItem.Content>
                        <ListItem.Title>Dark Mode</ListItem.Title>
                    </ListItem.Content>
                    <Switch
                        value={settings.darkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ true: colors.primary.blue }}
                    />
                </ListItem>

                <ListItem bottomDivider containerStyle={styles.listItem} onPress={() => { }}>
                    <Icon name="book-outline" type="ionicon" color={colors.primary.blue} />
                    <ListItem.Content>
                        <ListItem.Title>Bible Translation</ListItem.Title>
                        <ListItem.Subtitle>{settings.translation}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </View>

            {/* Support Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>

                <ListItem bottomDivider containerStyle={styles.listItem} onPress={() => { }}>
                    <Icon name="help-circle-outline" type="ionicon" color={colors.secondary.medium} />
                    <ListItem.Content>
                        <ListItem.Title>Help Center</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>

                <ListItem bottomDivider containerStyle={styles.listItem} onPress={() => { }}>
                    <Icon name="shield-checkmark-outline" type="ionicon" color={colors.secondary.medium} />
                    <ListItem.Content>
                        <ListItem.Title>Privacy Policy</ListItem.Title>
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
        ...commonStyles.container,
    },
    profileSection: {
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.white,
        marginBottom: spacing.m,
    },
    avatar: {
        backgroundColor: colors.primary.light,
        marginBottom: spacing.m,
    },
    name: {
        color: colors.primary.dark,
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
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.secondary.light,
    },
    sectionTitle: {
        padding: spacing.m,
        paddingBottom: spacing.s,
        color: colors.secondary.medium,
        fontSize: typography.sizes.small,
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
    },
    listItem: {
        backgroundColor: colors.white,
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
